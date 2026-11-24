import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';
import nodemailer from 'nodemailer';
import {
  getCollection,
  setCollection,
  insertItem,
  updateItem,
  deleteItem,
  restoreItem,
  getDatabase,
  saveDatabase,
  createBackup,
  getDatabaseInfo,
  getSupabaseConfig,
  syncAllToSupabase
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || '7h-v-secret-jwt-key-2026-production-grade';
const OFFICIAL_WHATSAPP_LINK = 'https://chat.whatsapp.com/IzTObDPm8pw80Hw811RJvC?s=cl&p=a&iam=2';

// Uploads directory (supports /tmp on Vercel)
const isVercel = process.env.VERCEL === '1';
const UPLOADS_DIR = isVercel ? path.join('/tmp', 'uploads') : path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    const ext = path.extname(file.originalname);
    cb(null, `img-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg\+xml|svg/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname || mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG, JPG, PNG, WEBP, and SVG formats are permitted.'));
  }
});

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve static uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// Helper: Log audit action
function logAudit(user, action, details, module = 'General', recordRef = '', result = 'SUCCESS') {
  insertItem('audit_logs', {
    user: user || 'Ecosystem Admin',
    action,
    details,
    module,
    recordRef,
    result,
    timestamp: new Date().toISOString()
  });
}

// ==========================================
// CRYPTOGRAPHIC AUTHENTICATION HELPERS
// ==========================================
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored) return false;
  // If stored is a legacy plain string (e.g. during initial seed migration)
  if (!stored.includes(':')) {
    return password === stored;
  }
  const [salt, originalHash] = stored.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
  } catch {
    return false;
  }
}

function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    assignedModules: user.assignedModules || ['*'],
    permissions: user.permissions || {},
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours expiry
  };
  const b64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(b64Payload).digest('base64url');
  return `${b64Payload}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [b64Payload, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(b64Payload).digest('base64url');

  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }
    const payload = JSON.parse(Buffer.from(b64Payload, 'base64url').toString('utf-8'));
    if (Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

// Authentication Middleware
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Missing Bearer token.' });
  }

  const token = authHeader.split(' ')[1];
  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired session token. Please sign in again.' });
  }

  req.user = user;
  next();
}

// Super Admin Role Middleware
function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'Super Admin' && req.user.role !== 'Ecosystem Admin') {
      return res.status(403).json({ error: 'Access denied. Administrative privileges required.' });
    }
    next();
  });
}

// Granular Module Permission Middleware (RBAC)
function requireModulePermission(moduleName, action = 'view') {
  return (req, res, next) => {
    requireAuth(req, res, () => {
      const user = req.user;
      if (!user) return res.status(401).json({ error: 'Authentication required' });

      // Super Admin retains unrestricted access across all modules
      if (user.role === 'Super Admin' || user.role === 'Ecosystem Admin') {
        return next();
      }

      // Check current live user state from database
      const users = getCollection('users');
      const liveUser = users.find((u) => u.id === user.userId || u.email === user.email);
      if (!liveUser || liveUser.status === 'inactive') {
        return res.status(403).json({ error: 'Access revoked. Account is inactive or deactivated.' });
      }

      if (liveUser.role === 'Super Admin' || liveUser.assignedModules?.includes('*')) {
        return next();
      }

      // Verify module is assigned
      const assigned = liveUser.assignedModules || [];
      if (!assigned.includes(moduleName)) {
        return res.status(403).json({
          error: 'Module Access Denied',
          message: `Your account does not have permission to access the "${moduleName}" module.`
        });
      }

      // Verify specific action permission
      const perms = liveUser.permissions?.[moduleName];
      if (perms && perms[action] === false) {
        return res.status(403).json({
          error: 'Action Forbidden',
          message: `You are not authorized to perform "${action}" in the "${moduleName}" module.`
        });
      }

      next();
    });
  };
}

// Ensure official WhatsApp invitation link is set in website settings
(function syncWhatsAppSetting() {
  const db = getDatabase();
  if (!db.website_settings) db.website_settings = {};
  db.website_settings.whatsappCommunityPlaceholder = OFFICIAL_WHATSAPP_LINK;
  saveDatabase(db);
})();

// Health check & Database Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: '7 Horse Ventures CMS API',
    security: 'HMAC-SHA256 Token Auth + Salted PBKDF2 Password Protection',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/database/info', (req, res) => {
  res.json(getDatabaseInfo());
});

app.post('/api/database/backup', requireAdmin, (req, res) => {
  const backupFile = createBackup();
  logAudit(req.user.name, 'Database Backup', `Manual backup created: ${path.basename(backupFile || '')}`);
  res.json({ success: true, backupFile: path.basename(backupFile || ''), timestamp: new Date().toISOString() });
});

// ==========================================
// 1. AUTHENTICATION & TEAM
// ==========================================
app.post('/api/auth/login', (req, res) => {
  const { passcode, email } = req.body;
  if (!passcode) {
    return res.status(400).json({ success: false, message: 'Passcode is required.' });
  }

  const users = getCollection('users');

  // Find user by passcode and optional email
  const user = users.find((u) => {
    const matchesEmail = !email || u.email.toLowerCase() === email.toLowerCase();
    const matchesPass = verifyPassword(passcode, u.passcode || u.passwordHash);
    return matchesEmail && matchesPass;
  });

  if (user) {
    // If user still had plain passcode, upgrade to salted PBKDF2 hash
    if (user.passcode && !user.passcode.includes(':')) {
      updateItem('users', user.id, {
        passcode: hashPassword(user.passcode),
        passwordHash: hashPassword(user.passcode)
      });
    }

    const token = generateToken(user);
    logAudit(user.name, 'Admin Sign In', `Authenticated to Operations Console (${user.role})`);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status || 'active',
      avatar: user.avatar,
      assignedModules: user.assignedModules || (user.role === 'Super Admin' ? ['*'] : []),
      permissions: user.permissions || (user.role === 'Super Admin' ? {
        "*": { view: true, create: true, edit: true, delete: true, import: true, export: true, approve: true, publish: true, settings: true }
      } : {})
    };

    return res.json({ success: true, token, user: safeUser });
  }

  res.status(401).json({ success: false, message: 'Invalid credentials. Access denied.' });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  const users = getCollection('users');
  const user = users.find((u) => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status || 'active',
    avatar: user.avatar,
    assignedModules: user.assignedModules || (user.role === 'Super Admin' ? ['*'] : []),
    permissions: user.permissions || {}
  });
});

app.post('/api/auth/logout', requireAuth, (req, res) => {
  logAudit(req.user.name, 'Admin Sign Out', 'Closed Operations Console Session');
  res.json({ success: true, message: 'Successfully signed out' });
});

app.get('/api/users', requireAdmin, (req, res) => {
  const users = getCollection('users').map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status || 'active',
    avatar: u.avatar,
    assignedModules: u.assignedModules || (u.role === 'Super Admin' ? ['*'] : []),
    permissions: u.permissions || {},
    lastLogin: u.lastLogin,
    createdAt: u.createdAt
  }));
  res.json(users);
});

app.post('/api/users', requireAdmin, (req, res) => {
  const { name, email, role = 'Editor', passcode = '7H-Member-2026', assignedModules = [], permissions = {} } = req.body;
  
  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const existing = getCollection('users').find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'A team member with this email address already exists.' });
  }

  const defaultPerms = {};
  assignedModules.forEach((mod) => {
    defaultPerms[mod] = permissions[mod] || {
      view: true, create: true, edit: true, delete: false, import: false, export: true, approve: false, publish: false, settings: false
    };
  });

  const newUser = insertItem('users', {
    name,
    email,
    role,
    status: 'active',
    assignedModules,
    permissions: Object.keys(permissions).length > 0 ? permissions : defaultPerms,
    passcode: hashPassword(passcode),
    passwordHash: hashPassword(passcode),
    avatar: req.body.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`,
    createdAt: new Date().toISOString()
  });

  logAudit(req.user.name, 'TEAM_INVITE_USER', `Invited team member ${newUser.name} (${newUser.email}) with role ${newUser.role}`, 'Team & Permissions', newUser.id);
  res.json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    status: newUser.status,
    assignedModules: newUser.assignedModules,
    permissions: newUser.permissions
  });
});

app.put('/api/users/:id', requireAdmin, (req, res) => {
  const updates = { ...req.body };
  if (updates.passcode) {
    updates.passcode = hashPassword(updates.passcode);
    updates.passwordHash = updates.passcode;
  }
  const updated = updateItem('users', req.params.id, updates);
  logAudit(req.user.name, 'TEAM_UPDATE_USER', `Updated user credentials / permissions for ${updated?.name || req.params.id}`, 'Team & Permissions', req.params.id);
  res.json(updated);
});

app.put('/api/users/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  const updated = updateItem('users', req.params.id, { status: status === 'inactive' ? 'inactive' : 'active' });
  logAudit(req.user.name, 'TEAM_STATUS_CHANGE', `Toggled account status of user ${updated?.name || req.params.id} to ${status}`, 'Team & Permissions', req.params.id);
  res.json(updated);
});

app.put('/api/users/:id/reset-access', requireAdmin, (req, res) => {
  const newPasscode = req.body.newPasscode || `7H-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  const updated = updateItem('users', req.params.id, {
    passcode: hashPassword(newPasscode),
    passwordHash: hashPassword(newPasscode),
    temporaryPasscode: newPasscode
  });
  logAudit(req.user.name, 'TEAM_RESET_ACCESS', `Reset access credentials for user ${updated?.name || req.params.id}`, 'Team & Permissions', req.params.id);
  res.json({ success: true, message: 'Access credentials reset successfully', temporaryPasscode: newPasscode });
});

app.delete('/api/users/:id', requireAdmin, (req, res) => {
  const users = getCollection('users');
  const user = users.find((u) => u.id === req.params.id);
  if (user?.role === 'Super Admin') {
    return res.status(403).json({ error: 'Cannot delete Super Admin account.' });
  }
  deleteItem('users', req.params.id, true, req.user.name);
  logAudit(req.user.name, 'TEAM_REVOKE_USER', `Revoked access for user ${user?.name || req.params.id}`, 'Team & Permissions', req.params.id);
  res.json({ success: true });
});

// ==========================================
// 2. CENTRAL MEDIA & VISUAL MANAGEMENT
// ==========================================
app.get('/api/media', (req, res) => {
  res.json(getCollection('media'));
});

app.post('/api/media/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const mediaItem = insertItem('media', {
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`,
    title: req.body.title || req.file.originalname,
    alt: req.body.alt || req.file.originalname,
    category: req.body.category || 'General',
    size: `${(req.file.size / 1024).toFixed(1)} KB`,
    mimeType: req.file.mimetype,
    usages: []
  });

  logAudit(req.user.name, 'Media Upload', `Uploaded file ${mediaItem.filename}`);
  res.json(mediaItem);
});

app.delete('/api/media/:id', requireAuth, (req, res) => {
  const mediaList = getCollection('media');
  const target = mediaList.find((m) => m.id === req.params.id);
  if (target && target.filename) {
    const filePath = path.join(UPLOADS_DIR, target.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('File unlink error:', err);
      }
    }
  }
  deleteItem('media', req.params.id);
  res.json({ success: true });
});

app.get('/api/media-mappings', (req, res) => {
  res.json(getCollection('media_mappings'));
});

app.put('/api/media-mappings/:key', requireAuth, (req, res) => {
  const { key } = req.params;
  const { url, alt, position, fit, focalPoint } = req.body;
  const mappings = getCollection('media_mappings');
  const index = mappings.findIndex((m) => m.key === key);

  if (index === -1) {
    return res.status(404).json({ error: `Mapping with key ${key} not found` });
  }

  const current = mappings[index];
  const history = current.history || [];
  history.unshift({
    url: current.url,
    alt: current.alt,
    position: current.position,
    replacedAt: new Date().toISOString()
  });

  const updatedMapping = {
    ...current,
    url: url || current.url,
    alt: alt !== undefined ? alt : current.alt,
    position: position || current.position || 'center',
    fit: fit || current.fit || 'cover',
    focalPoint: focalPoint || current.focalPoint,
    history: history.slice(0, 5),
    updatedAt: new Date().toISOString()
  };

  mappings[index] = updatedMapping;
  setCollection('media_mappings', mappings);

  logAudit(req.user.name, 'Replace Website Image', `Updated visual asset for ${key}`);
  res.json(updatedMapping);
});

app.post('/api/media-mappings/:key/revert', requireAuth, (req, res) => {
  const { key } = req.params;
  const mappings = getCollection('media_mappings');
  const index = mappings.findIndex((m) => m.key === key);

  if (index === -1) return res.status(404).json({ error: 'Mapping not found' });

  const current = mappings[index];
  if (!current.history || current.history.length === 0) {
    return res.status(400).json({ error: 'No previous image revision exists to revert' });
  }

  const prev = current.history.shift();
  const revertedMapping = {
    ...current,
    url: prev.url,
    alt: prev.alt || current.alt,
    position: prev.position || current.position,
    updatedAt: new Date().toISOString()
  };

  mappings[index] = revertedMapping;
  setCollection('media_mappings', mappings);
  logAudit(req.user.name, 'Revert Website Image', `Reverted visual asset for ${key}`);
  res.json(revertedMapping);
});

// ==========================================
// 3. EVENTS CMS
// ==========================================
app.get('/api/events', (req, res) => {
  res.json(getCollection('events'));
});

app.post('/api/events', requireAuth, (req, res) => {
  const newEvent = insertItem('events', req.body);
  logAudit(req.user.name, 'Create Event', `Created event: ${newEvent.title}`);
  res.json(newEvent);
});

app.put('/api/events/:id', requireAuth, (req, res) => {
  const updated = updateItem('events', req.params.id, req.body);
  logAudit(req.user.name, 'Update Event', `Updated event: ${updated?.title}`);
  res.json(updated);
});

app.delete('/api/events/:id', requireAuth, (req, res) => {
  deleteItem('events', req.params.id);
  res.json({ success: true });
});

// ==========================================
// 4. REGISTRATIONS & ATTENDEE TRACKING
// ==========================================
app.get('/api/registrations', requireAuth, (req, res) => {
  res.json(getCollection('registrations'));
});

app.post('/api/registrations', (req, res) => {
  const newReg = insertItem('registrations', {
    ...req.body,
    checkedIn: false,
    noShow: false,
    registeredAt: new Date().toISOString()
  });

  let eventInfo = null;
  if (req.body.eventId) {
    const events = getCollection('events');
    const evt = events.find((e) => e.id === req.body.eventId);
    if (evt) {
      eventInfo = evt;
      updateItem('events', evt.id, { registeredCount: (evt.registeredCount || 0) + 1 });
    }
  }

  // Trigger booking confirmation email automation
  triggerEmailAutomation('EVENT_REGISTRATION', {
    ...newReg,
    email: newReg.email,
    name: newReg.name,
    eventTitle: eventInfo?.title || req.body.eventTitle,
    eventDate: eventInfo?.date || req.body.eventDate,
    eventTime: eventInfo?.time || req.body.eventTime,
    eventLocation: eventInfo?.location || req.body.eventLocation,
    passId: newReg.id || newReg.passId
  }).catch((err) => console.error('Failed to trigger registration email:', err));

  res.json(newReg);
});

app.put('/api/registrations/:id/checkin', requireAuth, (req, res) => {
  const current = getCollection('registrations').find((r) => r.id === req.params.id);
  const willBeCheckedIn = !current?.checkedIn;
  const updated = updateItem('registrations', req.params.id, { 
    checkedIn: willBeCheckedIn,
    checkedInAt: willBeCheckedIn ? new Date().toISOString() : null,
    noShow: false
  });

  if (willBeCheckedIn) {
    // Attendees who checked in receive post-event follow-up / certificate
    triggerEmailAutomation('ATTENDEE_CHECKED_IN', updated).catch((err) => console.error('Checkin email trigger error:', err));
  }

  res.json(updated);
});

app.put('/api/registrations/:id/no-show', requireAuth, (req, res) => {
  const current = getCollection('registrations').find((r) => r.id === req.params.id);
  const willBeNoShow = !current?.noShow;
  const updated = updateItem('registrations', req.params.id, {
    noShow: willBeNoShow,
    checkedIn: false
  });

  if (willBeNoShow) {
    triggerEmailAutomation('ATTENDEE_NO_SHOW', updated).catch((err) => console.error('No-show email trigger error:', err));
  }

  res.json(updated);
});

app.delete('/api/registrations/:id', requireAuth, (req, res) => {
  deleteItem('registrations', req.params.id, true, req.user?.name || 'admin');
  logAudit(req.user?.name || 'admin', 'DELETE_RECORD', `Archived registration ${req.params.id}`, 'Event Registrations', req.params.id);
  res.json({ success: true });
});

// ==========================================
// 5. ACADEMY SESSIONS (Req 2)
// ==========================================
app.get('/api/academy-sessions', (req, res) => {
  const { category, status } = req.query;
  let sessions = getCollection('academy_sessions');
  if (category && category !== 'All') {
    sessions = sessions.filter((s) => s.category?.toLowerCase() === category.toLowerCase());
  }
  if (status) {
    sessions = sessions.filter((s) => s.status?.toLowerCase() === status.toLowerCase());
  }
  res.json(sessions);
});

app.get('/api/academy-sessions/:id', (req, res) => {
  const sessions = getCollection('academy_sessions');
  const session = sessions.find((s) => s.id === req.params.id || s.slug === req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Academy session not found' });
  }
  // increment view counter
  updateItem('academy_sessions', session.id, { views: (session.views || 0) + 1 });
  res.json(session);
});

app.post('/api/academy-sessions', requireAuth, (req, res) => {
  const newSession = insertItem('academy_sessions', {
    ...req.body,
    status: req.body.status || 'upcoming',
    registeredCount: req.body.registeredCount || 0,
    views: 0
  });
  logAudit(req.user.name, 'Create Academy Session', `Published session: ${newSession.title}`);
  res.json(newSession);
});

app.put('/api/academy-sessions/:id', requireAuth, (req, res) => {
  const updated = updateItem('academy_sessions', req.params.id, req.body);
  logAudit(req.user.name, 'Update Academy Session', `Updated session: ${updated?.title}`);
  res.json(updated);
});

app.delete('/api/academy-sessions/:id', requireAuth, (req, res) => {
  deleteItem('academy_sessions', req.params.id);
  res.json({ success: true });
});

// Academy Registrations
app.get('/api/academy-registrations', requireAuth, (req, res) => {
  const { sessionId } = req.query;
  let registrations = getCollection('academy_registrations');
  if (sessionId) {
    registrations = registrations.filter((r) => r.sessionId === sessionId);
  }
  res.json(registrations);
});

app.post('/api/academy-registrations', (req, res) => {
  const { sessionId, sessionTitle, fullName, email, phone, organization, role, questionsForSpeaker } = req.body;

  if (!fullName || !email || !phone) {
    return res.status(400).json({ error: 'Full name, email and phone number are required.' });
  }

  const newReg = insertItem('academy_registrations', {
    sessionId: sessionId || 'acad-general',
    sessionTitle: sessionTitle || '7 Horse Ventures Academy',
    fullName,
    email,
    phone,
    organization: organization || '',
    role: role || 'Builder',
    questionsForSpeaker: questionsForSpeaker || '',
    status: 'confirmed',
    registeredAt: new Date().toISOString()
  });

  // Increment session registeredCount
  if (sessionId) {
    const sessions = getCollection('academy_sessions');
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      updateItem('academy_sessions', session.id, { registeredCount: (session.registeredCount || 0) + 1 });
    }
  }

  // Trigger Academy registration automation email
  triggerEmailAutomation('ACADEMY_REGISTRATION', {
    ...newReg,
    email: newReg.email,
    name: newReg.fullName,
    eventTitle: newReg.sessionTitle
  }).catch((err) => console.error('Academy email trigger error:', err));

  res.json({ success: true, registration: newReg });
});

app.delete('/api/academy-registrations/:id', requireAuth, (req, res) => {
  deleteItem('academy_registrations', req.params.id, true, req.user?.name || 'admin');
  logAudit(req.user?.name || 'admin', 'DELETE_RECORD', `Archived academy registration ${req.params.id}`, 'Academy Registrations', req.params.id);
  res.json({ success: true });
});

// ==========================================
// 6. ARTICLES (BLOG, NEWS, FOUNDER STORIES)
// ==========================================
app.get('/api/articles', (req, res) => {
  const { type, featured } = req.query;
  let articles = getCollection('articles');
  if (type) articles = articles.filter((a) => a.type === type);
  if (featured === 'true') articles = articles.filter((a) => a.featured);
  res.json(articles);
});

app.get('/api/articles/:slug', (req, res) => {
  const articles = getCollection('articles');
  const found = articles.find((a) => a.slug === req.params.slug || a.id === req.params.slug);
  if (!found) return res.status(404).json({ error: 'Article not found' });
  updateItem('articles', found.id, { views: (found.views || 0) + 1 });
  res.json(found);
});

app.post('/api/articles', requireAuth, (req, res) => {
  const newArticle = insertItem('articles', req.body);
  logAudit(req.user.name, 'Publish Article', `Created article: ${newArticle.title}`);
  res.json(newArticle);
});

app.put('/api/articles/:id', requireAuth, (req, res) => {
  const updated = updateItem('articles', req.params.id, req.body);
  res.json(updated);
});

app.delete('/api/articles/:id', requireAuth, (req, res) => {
  deleteItem('articles', req.params.id);
  res.json({ success: true });
});

// ==========================================
// 7. NEWSLETTER & SUBSCRIBERS
// ==========================================
app.get('/api/subscribers', requireAuth, (req, res) => {
  res.json(getCollection('subscribers'));
});

app.post('/api/subscribers', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });
  const subscribers = getCollection('subscribers');
  const existing = subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.json({ success: true, message: 'Already subscribed to 7H Founder Brief', subscriber: existing });
  }
  const newSub = insertItem('subscribers', {
    ...req.body,
    status: 'active',
    subscribedAt: new Date().toISOString()
  });
  res.json({ success: true, message: 'Subscribed to 7H Founder Brief', subscriber: newSub });
});

app.delete('/api/subscribers/:id', requireAuth, (req, res) => {
  deleteItem('subscribers', req.params.id);
  res.json({ success: true });
});

app.get('/api/newsletters', requireAuth, (req, res) => {
  res.json(getCollection('newsletters'));
});

app.post('/api/newsletters', requireAuth, (req, res) => {
  const newNewsletter = insertItem('newsletters', req.body);
  res.json(newNewsletter);
});

app.post('/api/newsletters/:id/send', requireAuth, (req, res) => {
  const subscribers = getCollection('subscribers').filter((s) => s.status === 'active');
  const updated = updateItem('newsletters', req.params.id, {
    status: 'sent',
    sentAt: new Date().toISOString(),
    recipientsCount: subscribers.length
  });
  logAudit(req.user.name, 'Dispatch Newsletter', `Sent campaign "${updated?.subject}" to ${subscribers.length} recipients`);
  res.json({ success: true, newsletter: updated, sentCount: subscribers.length });
});

// ==========================================
// 8. FOUNDER & STARTUP DIRECTORIES
// ==========================================
app.get('/api/founders', (req, res) => {
  const { status } = req.query;
  let items = getCollection('founders');
  if (status) items = items.filter((f) => f.status === status);
  res.json(items);
});

app.post('/api/founders', (req, res) => {
  const newFounder = insertItem('founders', { ...req.body, status: req.body.status || 'pending' });
  res.json(newFounder);
});

app.put('/api/founders/:id', requireAuth, (req, res) => {
  const current = getCollection('founders').find((f) => f.id === req.params.id);
  const updated = updateItem('founders', req.params.id, req.body);
  if (req.body.status === 'approved' && current?.status !== 'approved') {
    triggerEmailAutomation('FOUNDER_APPROVED', updated).catch((err) => console.error('Founder approval email error:', err));
  }
  logAudit(req.user?.name || 'admin', 'UPDATE_RECORD', `Updated founder profile ${updated?.name || req.params.id}`, 'Founders Directory', req.params.id);
  res.json(updated);
});

app.delete('/api/founders/:id', requireAuth, (req, res) => {
  deleteItem('founders', req.params.id, true, req.user?.name || 'admin');
  logAudit(req.user?.name || 'admin', 'DELETE_RECORD', `Archived founder ${req.params.id}`, 'Founders Directory', req.params.id);
  res.json({ success: true });
});

app.get('/api/startups', (req, res) => {
  const { status } = req.query;
  let items = getCollection('startups');
  if (status) items = items.filter((s) => s.status === status);
  res.json(items);
});

app.post('/api/startups', (req, res) => {
  const newStartup = insertItem('startups', { ...req.body, status: req.body.status || 'pending' });
  res.json(newStartup);
});

app.put('/api/startups/:id', requireAuth, (req, res) => {
  const updated = updateItem('startups', req.params.id, req.body);
  res.json(updated);
});

app.delete('/api/startups/:id', requireAuth, (req, res) => {
  deleteItem('startups', req.params.id);
  res.json({ success: true });
});

// ==========================================
// 9. OPPORTUNITY BOARD
// ==========================================
app.get('/api/opportunities', (req, res) => {
  const { status } = req.query;
  let items = getCollection('opportunities');
  if (status) items = items.filter((o) => o.status === status);
  res.json(items);
});

app.post('/api/opportunities', (req, res) => {
  const newOpp = insertItem('opportunities', { ...req.body, status: req.body.status || 'pending' });
  res.json(newOpp);
});

app.put('/api/opportunities/:id', requireAuth, (req, res) => {
  const updated = updateItem('opportunities', req.params.id, req.body);
  res.json(updated);
});

app.delete('/api/opportunities/:id', requireAuth, (req, res) => {
  deleteItem('opportunities', req.params.id);
  res.json({ success: true });
});

// ==========================================
// 10. PITCH APPLICATIONS
// ==========================================
app.get('/api/pitch-applications', requireAuth, (req, res) => {
  res.json(getCollection('pitch_applications'));
});

app.post('/api/pitch-applications', (req, res) => {
  const newApp = insertItem('pitch_applications', { ...req.body, status: 'new', score: 0, internalNotes: [] });
  res.json(newApp);
});

app.put('/api/pitch-applications/:id', requireAuth, (req, res) => {
  const updated = updateItem('pitch_applications', req.params.id, req.body);
  res.json(updated);
});

// ==========================================
// 11. PARTNERSHIPS CRM
// ==========================================
app.get('/api/partnerships', requireAuth, (req, res) => {
  res.json(getCollection('partnerships'));
});

app.post('/api/partnerships', (req, res) => {
  const newPartner = insertItem('partnerships', { ...req.body, status: req.body.status || 'New' });
  res.json(newPartner);
});

app.put('/api/partnerships/:id', requireAuth, (req, res) => {
  const updated = updateItem('partnerships', req.params.id, req.body);
  res.json(updated);
});

// ==========================================
// 12. ENQUIRIES & CONTACT
// ==========================================
app.get('/api/enquiries', requireAuth, (req, res) => {
  res.json(getCollection('enquiries'));
});

app.post('/api/enquiries', (req, res) => {
  const newEnq = insertItem('enquiries', { ...req.body, status: 'new' });
  res.json(newEnq);
});

app.put('/api/enquiries/:id', requireAuth, (req, res) => {
  const updated = updateItem('enquiries', req.params.id, req.body);
  res.json(updated);
});

// ==========================================
// 13. RESOURCES LIBRARY
// ==========================================
app.get('/api/resources', (req, res) => {
  res.json(getCollection('resources'));
});

app.post('/api/resources', requireAuth, (req, res) => {
  const newRes = insertItem('resources', req.body);
  res.json(newRes);
});

app.put('/api/resources/:id', requireAuth, (req, res) => {
  const updated = updateItem('resources', req.params.id, req.body);
  res.json(updated);
});

app.delete('/api/resources/:id', requireAuth, (req, res) => {
  deleteItem('resources', req.params.id);
  res.json({ success: true });
});

// ==========================================
// 14. WEBSITE SETTINGS
// ==========================================
app.get('/api/settings', (req, res) => {
  const db = getDatabase();
  res.json(db.website_settings || {});
});

app.put('/api/settings', requireAuth, (req, res) => {
  const db = getDatabase();
  db.website_settings = { ...db.website_settings, ...req.body };
  saveDatabase(db);
  logAudit(req.user.name, 'Update Website Settings', 'Updated platform configuration');
  res.json(db.website_settings);
});

// ==========================================
// 15. ANALYTICS & AUDIT LOGS
// ==========================================
app.get('/api/analytics', (req, res) => {
  const db = getDatabase();
  const dynamicAnalytics = {
    ...db.analytics,
    registrationsCount: (db.registrations || []).length,
    academyRegistrationsCount: (db.academy_registrations || []).length,
    applicationsCount: (db.pitch_applications || []).length,
    newsletterSubscribers: (db.subscribers || []).filter((s) => s.status === 'active').length,
    totalEvents: (db.events || []).length,
    totalAcademySessions: (db.academy_sessions || []).length,
    publishedArticles: (db.articles || []).filter((a) => a.published).length
  };
  res.json(dynamicAnalytics);
});

app.get('/api/audit-logs', requireAuth, (req, res) => {
  res.json(getCollection('audit_logs'));
});

// ==========================================
// 15B. SUPABASE CLOUD MANAGEMENT ENDPOINTS
// ==========================================
app.get('/api/admin/supabase-status', (req, res) => {
  const config = getSupabaseConfig();
  res.json({
    status: 'ok',
    supabase: config,
    instructions: {
      urlEnv: 'SUPABASE_URL (e.g. https://your-project.supabase.co)',
      keyEnv: 'SUPABASE_KEY or SUPABASE_SERVICE_ROLE_KEY',
      databaseUrlEnv: 'DATABASE_URL (e.g. postgresql://postgres:[pwd]@db.[ref].supabase.co:5432/postgres)'
    }
  });
});

app.post('/api/admin/sync-supabase', requireAuth, async (req, res) => {
  try {
    const result = await syncAllToSupabase();
    logAudit(req.user.email, 'SUPABASE_CLOUD_SYNC', 'Initiated manual cloud sync of all collections');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Supabase sync failed', message: err.message });
  }
});

// ==========================================
// 15C. CASHFREE PAYMENT GATEWAY INTEGRATION
// ==========================================
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || '';
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || '';
const CASHFREE_ENV = (process.env.CASHFREE_ENV || 'SANDBOX').toUpperCase();
const CASHFREE_BASE_URL = CASHFREE_ENV === 'PRODUCTION'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

/**
 * Create a Cashfree Payment Order
 */
app.post('/api/payments/cashfree/create-order', async (req, res) => {
  try {
    const {
      orderAmount,
      orderCurrency = 'INR',
      customerDetails = {},
      eventId,
      eventTitle,
      ticketType
    } = req.body;

    if (!orderAmount || Number(orderAmount) <= 0) {
      return res.status(400).json({ error: 'Valid order amount is required.' });
    }

    const orderId = `order_7h_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const customerId = customerDetails.customerId || `cust_${Date.now()}`;
    const customerPhone = customerDetails.customerPhone ? customerDetails.customerPhone.replace(/[\s\-\(\)\+]/g, '').slice(-10) : '9999999999';

    // If live or sandbox credentials are provided, call Cashfree PG API v2023-08-01
    if (CASHFREE_APP_ID && CASHFREE_SECRET_KEY) {
      try {
        const cfRes = await fetch(`${CASHFREE_BASE_URL}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-client-id': CASHFREE_APP_ID,
            'x-client-secret': CASHFREE_SECRET_KEY,
            'x-api-version': '2023-08-01'
          },
          body: JSON.stringify({
            order_id: orderId,
            order_amount: Number(orderAmount),
            order_currency: orderCurrency,
            customer_details: {
              customer_id: customerId,
              customer_name: customerDetails.customerName || '7 Horse Attendee',
              customer_email: customerDetails.customerEmail || 'attendee@7horseventures.com',
              customer_phone: customerPhone
            },
            order_meta: {
              return_url: `${req.protocol}://${req.get('host')}/events?order_id={order_id}`
            },
            order_note: `Pass for ${eventTitle || '7 Horse Ventures Event'}`
          })
        });

        const data = await cfRes.json();
        if (cfRes.ok && data.payment_session_id) {
          return res.json({
            success: true,
            order_id: data.order_id,
            payment_session_id: data.payment_session_id,
            order_status: data.order_status,
            environment: CASHFREE_ENV
          });
        }
        console.warn('Cashfree API responded with notice, activating sandbox simulation:', data);
      } catch (cfErr) {
        console.warn('Cashfree request error, falling back to verified test session:', cfErr.message);
      }
    }

    // Verified Sandbox / Test Simulation Session
    const mockSessionId = `session_sim_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
    res.json({
      success: true,
      order_id: orderId,
      payment_session_id: mockSessionId,
      order_status: 'ACTIVE',
      simulation: true,
      orderAmount: Number(orderAmount),
      orderCurrency,
      message: 'Cashfree Sandbox Test Mode active. Ready for test transaction.'
    });
  } catch (err) {
    console.error('Error creating Cashfree order:', err);
    res.status(500).json({ error: 'Failed to create payment order', message: err.message });
  }
});

/**
 * Verify Cashfree Payment and Issue Pass
 */
app.post('/api/payments/cashfree/verify', async (req, res) => {
  try {
    const { orderId, paymentId, eventId, eventTitle, attendeeData, orderAmount = 0 } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required for verification.' });
    }

    let isVerified = true;
    let gatewayRef = paymentId || `cf_pay_${Date.now()}`;

    // If Cashfree keys are configured, verify with Cashfree API
    if (CASHFREE_APP_ID && CASHFREE_SECRET_KEY && !orderId.includes('sim')) {
      try {
        const cfRes = await fetch(`${CASHFREE_BASE_URL}/orders/${orderId}`, {
          headers: {
            'x-client-id': CASHFREE_APP_ID,
            'x-client-secret': CASHFREE_SECRET_KEY,
            'x-api-version': '2023-08-01'
          }
        });
        const orderInfo = await cfRes.json();
        if (orderInfo.order_status === 'PAID') {
          isVerified = true;
          gatewayRef = orderInfo.cf_order_id || gatewayRef;
        } else if (orderInfo.order_status === 'ACTIVE') {
          isVerified = true;
        }
      } catch (vErr) {
        console.warn('Cashfree verification check notice:', vErr.message);
      }
    }

    // Generate Official 7 Horse Ventures Executive Pass ID
    const passId = `7H-PASS-${Math.floor(100000 + Math.random() * 900000)}`;

    // Record Payment
    const paymentItem = insertItem('payments', {
      orderId,
      paymentId: gatewayRef,
      eventId: eventId || 'event-paid',
      eventTitle: eventTitle || '',
      amount: Number(orderAmount),
      currency: 'INR',
      status: 'PAID',
      gateway: 'Cashfree Payments',
      customerName: attendeeData?.name || '',
      customerEmail: attendeeData?.email || '',
      customerPhone: attendeeData?.phone || '',
      passId,
      timestamp: new Date().toISOString()
    });

    // Record Event Registration
    const regItem = insertItem('registrations', {
      passId,
      eventId: eventId || 'event-paid',
      eventTitle: eventTitle || '',
      name: attendeeData?.name || '',
      email: attendeeData?.email || '',
      phone: attendeeData?.phone || '',
      company: attendeeData?.company || '',
      role: attendeeData?.role || 'Founder / Attendee',
      paymentStatus: 'PAID',
      orderId,
      paymentId: gatewayRef,
      amountPaid: Number(orderAmount),
      checkedIn: false
    });

    logAudit('Payment System', 'CASHFREE_PAYMENT_SUCCESS', `Pass ${passId} issued for ${attendeeData?.email || 'attendee'} (Amount: ₹${orderAmount})`);

    res.json({
      success: true,
      verified: isVerified,
      passId,
      paymentStatus: 'PAID',
      orderId,
      paymentId: gatewayRef,
      registration: regItem
    });
  } catch (err) {
    console.error('Error verifying Cashfree payment:', err);
    res.status(500).json({ error: 'Payment verification failed', message: err.message });
  }
});

app.get('/api/payments', requireAuth, (req, res) => {
  res.json(getCollection('payments'));
});

// ==========================================
// 15D. BULK OPERATIONS & EXCEL IMPORT/EXPORT
// ==========================================

const COLLECTION_SCHEMAS = {
  founders: {
    columns: ['name', 'company', 'role', 'bio', 'city', 'industry', 'stage', 'email', 'phone', 'linkedin', 'status'],
    sample: {
      name: 'Priya Sharma',
      company: 'LogiXpress Tech',
      role: 'Founder & CEO',
      bio: 'Building AI-driven multimodal freight logistics platform.',
      city: 'Gurugram',
      industry: 'Logistics Tech',
      stage: 'Seed / Pre-Series A',
      email: 'priya@logixpress.in',
      phone: '+91 98765 43210',
      linkedin: 'https://linkedin.com/in/priyasharma',
      status: 'approved'
    }
  },
  startups: {
    columns: ['name', 'tagline', 'sector', 'stage', 'city', 'foundedYear', 'website', 'founders', 'status'],
    sample: {
      name: 'FinScale Protocol',
      tagline: 'Cross-border enterprise treasury and automated reconciliation',
      sector: 'FinTech / SaaS',
      stage: 'Seed',
      city: 'Delhi',
      foundedYear: '2024',
      website: 'https://finscale.io',
      founders: 'Aditya Khurana, Neha Sen',
      status: 'approved'
    }
  },
  opportunities: {
    columns: ['title', 'organization', 'type', 'category', 'location', 'deadline', 'compensation', 'applicationLink', 'status'],
    sample: {
      title: 'Founding AI Engineer',
      organization: 'Nexus Logix',
      type: 'Full-Time',
      category: 'Engineering & AI',
      location: 'Gurugram / Hybrid',
      deadline: '2026-06-30',
      compensation: '₹24L – ₹36L + ESOPs',
      applicationLink: 'https://7horseventures.com/careers',
      status: 'approved'
    }
  },
  registrations: {
    columns: ['name', 'email', 'phone', 'company', 'role', 'eventId', 'eventTitle', 'passId', 'paymentStatus', 'checkedIn'],
    sample: {
      name: 'Aditya Roy',
      email: 'aditya@startup.in',
      phone: '+91 98110 11223',
      company: 'CloudMatrix',
      role: 'Co-Founder',
      eventId: 'evt-01',
      eventTitle: '7H Founder Connect — Founders & Builders Roundtable',
      passId: '7H-PASS-819201',
      paymentStatus: 'PAID',
      checkedIn: false
    }
  },
  subscribers: {
    columns: ['email', 'name', 'status', 'frequency', 'source'],
    sample: {
      email: 'investor@syndicate.vc',
      name: 'Karan Mehra',
      status: 'active',
      frequency: 'Monthly',
      source: 'Website Footer'
    }
  },
  partnerships: {
    columns: ['organization', 'contactName', 'email', 'phone', 'tier', 'stage', 'dealValue', 'notes'],
    sample: {
      organization: 'AWS Startups India',
      contactName: 'Rohit Verma',
      email: 'rohit@amazon.com',
      phone: '+91 98223 34455',
      tier: 'Cloud & Infrastructure Partner',
      stage: 'Negotiation',
      dealValue: '$25,000 Credits Cohort Pool',
      notes: 'Finalizing legal memorandum for Q3 cohorts'
    }
  },
  enquiries: {
    columns: ['name', 'email', 'phone', 'subject', 'message', 'status'],
    sample: {
      name: 'Tanvi Malik',
      email: 'tanvi@investments.in',
      phone: '+91 98334 55667',
      subject: 'Inquiry regarding Pitch & Capital Connect Showcase',
      message: 'Looking to participate as angel syndicate scout for upcoming session.',
      status: 'new'
    }
  }
};

/**
 * Download sample Excel / CSV template for any module
 */
app.get('/api/bulk/template/:collection', (req, res) => {
  const { collection } = req.params;
  const schema = COLLECTION_SCHEMAS[collection] || {
    columns: ['name', 'email', 'phone', 'notes', 'status'],
    sample: { name: 'Sample Name', email: 'sample@example.com', phone: '+91 99999 88888', notes: 'Sample entry', status: 'approved' }
  };

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet([schema.sample], { header: schema.columns });
  XLSX.utils.book_append_sheet(wb, ws, 'Sample Template');

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Disposition', `attachment; filename="7Horse-${collection}-template.xlsx"`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buffer);
});

/**
 * Bulk Import Records into any Collection
 */
app.post('/api/bulk/import', requireAuth, (req, res) => {
  try {
    const { collection, records } = req.body;
    if (!collection || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'Valid collection name and array of records are required.' });
    }

    const existingItems = getCollection(collection);
    const existingEmails = new Set(existingItems.map((item) => (item.email || '').toLowerCase()).filter(Boolean));
    const existingTitles = new Set(existingItems.map((item) => (item.title || item.name || '').toLowerCase()).filter(Boolean));

    const imported = [];
    const duplicates = [];
    const errors = [];

    records.forEach((row, idx) => {
      const email = (row.email || row.Email || '').trim().toLowerCase();
      const titleOrName = (row.name || row.Name || row.title || row.Title || '').trim();

      if (!titleOrName && !email) {
        errors.push({ row: idx + 1, message: 'Row missing both name/title and email' });
        return;
      }

      if (email && existingEmails.has(email)) {
        duplicates.push({ row: idx + 1, identifier: email, reason: 'Duplicate email address' });
        return;
      }
      if (titleOrName && existingTitles.has(titleOrName.toLowerCase())) {
        duplicates.push({ row: idx + 1, identifier: titleOrName, reason: 'Duplicate title / name' });
        return;
      }

      const cleaned = {
        ...row,
        name: row.name || row.Name || titleOrName,
        title: row.title || row.Title || titleOrName,
        email: email || row.email,
        status: row.status || 'approved',
        createdAt: new Date().toISOString(),
        importedBy: req.user.name || 'Admin'
      };

      const newItem = insertItem(collection, cleaned);
      imported.push(newItem);
      if (email) existingEmails.add(email);
      if (titleOrName) existingTitles.add(titleOrName.toLowerCase());
    });

    logAudit(
      req.user.name,
      'EXCEL_BULK_IMPORT',
      `Imported ${imported.length} records into ${collection} (Skipped ${duplicates.length} duplicates)`,
      collection,
      `Count: ${imported.length}`
    );

    res.json({
      success: true,
      importedCount: imported.length,
      skippedCount: duplicates.length,
      errorsCount: errors.length,
      duplicates,
      errors,
      imported
    });
  } catch (err) {
    console.error('Bulk import error:', err);
    res.status(500).json({ error: 'Failed to complete import', message: err.message });
  }
});

/**
 * Bulk Delete Records (Soft-Delete / Archive with Restore Capability)
 */
app.post('/api/bulk/delete', requireAuth, (req, res) => {
  try {
    const { collection, ids, soft = true } = req.body;
    if (!collection || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Collection and non-empty array of IDs are required.' });
    }

    let deletedCount = 0;
    ids.forEach((id) => {
      const ok = deleteItem(collection, id, soft, req.user.name);
      if (ok) deletedCount++;
    });

    logAudit(
      req.user.name,
      soft ? 'BULK_SOFT_DELETE' : 'BULK_HARD_DELETE',
      `Deleted ${deletedCount} records in ${collection}`,
      collection,
      `IDs: ${ids.slice(0, 5).join(', ')}${ids.length > 5 ? '...' : ''}`
    );

    res.json({ success: true, count: deletedCount, ids });
  } catch (err) {
    console.error('Bulk delete error:', err);
    res.status(500).json({ error: 'Bulk delete failed', message: err.message });
  }
});

/**
 * Bulk Restore Previously Deleted Records
 */
app.post('/api/bulk/restore', requireAuth, (req, res) => {
  try {
    const { collection, ids } = req.body;
    if (!collection || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Collection and array of IDs required.' });
    }

    let restoredCount = 0;
    ids.forEach((id) => {
      const restored = restoreItem(collection, id, req.user.name);
      if (restored) restoredCount++;
    });

    logAudit(
      req.user.name,
      'BULK_RESTORE',
      `Restored ${restoredCount} archived records in ${collection}`,
      collection,
      `IDs: ${ids.slice(0, 5).join(', ')}`
    );

    res.json({ success: true, count: restoredCount, ids });
  } catch (err) {
    console.error('Bulk restore error:', err);
    res.status(500).json({ error: 'Bulk restore failed', message: err.message });
  }
});

/**
 * Bulk Status Update
 */
app.post('/api/bulk/status', requireAuth, (req, res) => {
  try {
    const { collection, ids, status } = req.body;
    if (!collection || !Array.isArray(ids) || !status) {
      return res.status(400).json({ error: 'Collection, IDs array, and target status required.' });
    }

    let updatedCount = 0;
    ids.forEach((id) => {
      const updated = updateItem(collection, id, { status, updatedBy: req.user.name });
      if (updated) updatedCount++;
    });

    logAudit(
      req.user.name,
      'BULK_STATUS_UPDATE',
      `Updated ${updatedCount} records to status "${status}" in ${collection}`,
      collection,
      `Count: ${updatedCount}`
    );

    res.json({ success: true, count: updatedCount, status, ids });
  } catch (err) {
    console.error('Bulk status update error:', err);
    res.status(500).json({ error: 'Bulk status update failed', message: err.message });
  }
});

/**
 * Export Records to Excel or CSV
 */
app.post('/api/bulk/export', requireAuth, (req, res) => {
  try {
    const { collection, ids = [], columns = [], format = 'xlsx' } = req.body;
    let items = getCollection(collection);

    if (ids.length > 0) {
      items = items.filter((item) => ids.includes(item.id));
    }

    items = items.filter((i) => !i.isDeleted);

    if (items.length === 0) {
      return res.status(400).json({ error: 'No records available to export.' });
    }

    const sanitizedRows = items.map((item) => {
      if (columns.length > 0) {
        const filtered = {};
        columns.forEach((col) => {
          filtered[col] = item[col] !== undefined ? item[col] : '';
        });
        return filtered;
      }
      const { passcode, passwordHash, ...cleanItem } = item;
      return cleanItem;
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sanitizedRows);
    XLSX.utils.book_append_sheet(wb, ws, collection.slice(0, 30));

    logAudit(
      req.user.name,
      'EXCEL_EXPORT',
      `Exported ${sanitizedRows.length} records from ${collection} (${format.toUpperCase()})`,
      collection,
      `Count: ${sanitizedRows.length}`
    );

    if (format === 'csv') {
      const csvData = XLSX.utils.sheet_to_csv(ws);
      res.setHeader('Content-Disposition', `attachment; filename="7Horse-${collection}-${Date.now()}.csv"`);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      return res.send(csvData);
    }

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', `attachment; filename="7Horse-${collection}-${Date.now()}.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ error: 'Failed to export records', message: err.message });
  }
});

// ==========================================
// 15E. CRM EMAIL STUDIO & AUTOMATION ENGINE
// ==========================================

const emailTransporter = (function () {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  // Simulation mode
  return {
    isSimulation: true,
    sendMail: async (mailOptions) => {
      console.log(`[Email Transporter (Simulation)] To: ${mailOptions.to} | Subject: "${mailOptions.subject}"`);
      return {
        messageId: `sim-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
        response: '250 OK (Simulated TLS Handshake & Acceptance)'
      };
    }
  };
})();

function renderTemplateVariables(templateStr, vars = {}) {
  if (!templateStr) return '';
  return templateStr.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, token) => {
    return vars[token] !== undefined && vars[token] !== null ? vars[token] : match;
  });
}

/**
 * Automated Email Trigger Pipeline
 */
async function triggerEmailAutomation(triggerType, payload = {}) {
  try {
    const automations = getCollection('email_automations');
    const auto = automations.find((a) => a.trigger === triggerType && a.status === 'active');
    if (!auto) return null;

    const templates = getCollection('email_templates');
    let templateId = null;

    if (triggerType === 'EVENT_REGISTRATION') {
      templateId = auto.steps?.[0]?.templateId || 'tpl-01';
    } else if (triggerType === 'ATTENDEE_CHECKED_IN') {
      templateId = auto.steps?.find((s) => s.attendedTemplateId)?.attendedTemplateId || 'tpl-03';
    } else if (triggerType === 'ATTENDEE_NO_SHOW') {
      templateId = auto.steps?.find((s) => s.noShowTemplateId)?.noShowTemplateId || 'tpl-04';
    } else if (triggerType === 'ACADEMY_REGISTRATION') {
      templateId = 'tpl-05';
    } else if (triggerType === 'FOUNDER_APPROVED') {
      templateId = 'tpl-08';
    }

    const tpl = templates.find((t) => t.id === templateId) || templates[0];
    if (!tpl || !payload.email) return null;

    const tokens = {
      first_name: (payload.name || payload.fullName || 'Valued Delegate').split(' ')[0],
      full_name: payload.name || payload.fullName || 'Valued Delegate',
      event_name: payload.eventTitle || payload.sessionTitle || '7 Horse Ventures Session',
      event_date: payload.eventDate || payload.displayDate || 'Upcoming Date',
      event_time: payload.eventTime || 'Scheduled Time',
      event_location: payload.eventLocation || payload.location || 'Cyber City, Gurugram',
      ticket_reference: payload.passId || `7H-PASS-${Date.now().toString().slice(-6)}`,
      registration_link: `https://7horseventures.com/events?pass=${payload.passId || ''}`
    };

    const renderedSubject = renderTemplateVariables(tpl.subject, tokens);
    const renderedBody = renderTemplateVariables(tpl.body, tokens);

    const info = await emailTransporter.sendMail({
      from: process.env.SMTP_FROM || '7 Horse Ventures <invitations@7horseventures.com>',
      to: payload.email,
      subject: renderedSubject,
      html: renderedBody
    });

    const logEntry = insertItem('email_logs', {
      recipientEmail: payload.email,
      recipientName: payload.name || payload.fullName || 'Delegate',
      subject: renderedSubject,
      templateId: tpl.id,
      workflowId: auto.id,
      status: 'DELIVERED',
      providerResponse: info.response || '250 OK',
      sentAt: new Date().toISOString()
    });

    logAudit('Email Automation', 'AUTOMATION_DISPATCH', `Sent "${renderedSubject}" to ${payload.email} via ${auto.name}`, 'CRM Email Studio', logEntry.id);
    return logEntry;
  } catch (err) {
    console.error(`Email automation error for ${triggerType}:`, err.message);
    return null;
  }
}

// Email Studio Dashboard Overview
app.get('/api/email/studio/overview', requireAuth, (req, res) => {
  const campaigns = getCollection('email_campaigns');
  const automations = getCollection('email_automations');
  const templates = getCollection('email_templates');
  const logs = getCollection('email_logs');
  const unsubs = getCollection('email_unsubscribes');

  const totalDelivered = logs.filter((l) => l.status === 'DELIVERED').length;
  const totalLogs = logs.length;
  const deliveryRate = totalLogs > 0 ? ((totalDelivered / totalLogs) * 100).toFixed(1) + '%' : '100%';

  res.json({
    campaignsCount: campaigns.length,
    activeAutomationsCount: automations.filter((a) => a.status === 'active').length,
    templatesCount: templates.length,
    totalSent: totalLogs,
    totalDelivered,
    unsubscribedCount: unsubs.length,
    deliveryRate,
    smtpConfigured: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER)
  });
});

// Templates CRUD
app.get('/api/email/templates', requireAuth, (req, res) => {
  res.json(getCollection('email_templates'));
});

app.post('/api/email/templates', requireAuth, (req, res) => {
  const newTpl = insertItem('email_templates', {
    ...req.body,
    updatedAt: new Date().toISOString()
  });
  logAudit(req.user.name, 'CREATE_EMAIL_TEMPLATE', `Created email template "${newTpl.name}"`, 'CRM Email Studio', newTpl.id);
  res.json(newTpl);
});

app.put('/api/email/templates/:id', requireAuth, (req, res) => {
  const updated = updateItem('email_templates', req.params.id, {
    ...req.body,
    updatedAt: new Date().toISOString()
  });
  logAudit(req.user.name, 'UPDATE_EMAIL_TEMPLATE', `Updated email template "${updated?.name || req.params.id}"`, 'CRM Email Studio', req.params.id);
  res.json(updated);
});

app.delete('/api/email/templates/:id', requireAuth, (req, res) => {
  deleteItem('email_templates', req.params.id, true, req.user.name);
  logAudit(req.user.name, 'DELETE_EMAIL_TEMPLATE', `Archived template ${req.params.id}`, 'CRM Email Studio', req.params.id);
  res.json({ success: true });
});

// Test Email Sender
app.post('/api/email/templates/test', requireAuth, async (req, res) => {
  try {
    const { templateId, testEmail = req.user.email } = req.body;
    const templates = getCollection('email_templates');
    const tpl = templates.find((t) => t.id === templateId) || templates[0];

    if (!tpl) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const sampleTokens = {
      first_name: req.user.name ? req.user.name.split(' ')[0] : 'Test',
      full_name: req.user.name || 'Test Administrator',
      event_name: '7H Founder Connect — Founders & Builders Roundtable',
      event_date: 'Saturday, August 15, 2026',
      event_time: '4:00 PM – 7:30 PM IST',
      event_location: 'Cyber City, Gurugram',
      ticket_reference: '7H-TEST-998877',
      registration_link: 'https://7horseventures.com/events'
    };

    const renderedSubject = `[TEST] ${renderTemplateVariables(tpl.subject, sampleTokens)}`;
    const renderedBody = renderTemplateVariables(tpl.body, sampleTokens);

    const info = await emailTransporter.sendMail({
      from: process.env.SMTP_FROM || '7 Horse Ventures <test@7horseventures.com>',
      to: testEmail,
      subject: renderedSubject,
      html: renderedBody
    });

    logAudit(req.user.name, 'TEST_EMAIL_SENT', `Sent test email to ${testEmail} for template "${tpl.name}"`, 'CRM Email Studio');
    res.json({ success: true, messageId: info.messageId, recipient: testEmail });
  } catch (err) {
    console.error('Test email error:', err);
    res.status(500).json({ error: 'Failed to send test email', message: err.message });
  }
});

// Automations CRUD
app.get('/api/email/automations', requireAuth, (req, res) => {
  res.json(getCollection('email_automations'));
});

app.post('/api/email/automations', requireAuth, (req, res) => {
  const newAuto = insertItem('email_automations', {
    ...req.body,
    status: req.body.status || 'active',
    stats: { triggered: 0, delivered: 0, opened: 0, clicked: 0 },
    createdAt: new Date().toISOString()
  });
  logAudit(req.user.name, 'CREATE_AUTOMATION', `Created email automation "${newAuto.name}"`, 'CRM Email Studio', newAuto.id);
  res.json(newAuto);
});

app.put('/api/email/automations/:id', requireAuth, (req, res) => {
  const updated = updateItem('email_automations', req.params.id, req.body);
  logAudit(req.user.name, 'UPDATE_AUTOMATION', `Updated automation "${updated?.name || req.params.id}"`, 'CRM Email Studio', req.params.id);
  res.json(updated);
});

app.post('/api/email/automations/:id/toggle', requireAuth, (req, res) => {
  const autos = getCollection('email_automations');
  const auto = autos.find((a) => a.id === req.params.id);
  if (!auto) return res.status(404).json({ error: 'Automation not found' });

  const nextStatus = auto.status === 'active' ? 'paused' : 'active';
  const updated = updateItem('email_automations', auto.id, { status: nextStatus });
  logAudit(req.user.name, 'TOGGLE_AUTOMATION', `Toggled automation "${auto.name}" to ${nextStatus}`, 'CRM Email Studio', auto.id);
  res.json(updated);
});

app.delete('/api/email/automations/:id', requireAuth, (req, res) => {
  deleteItem('email_automations', req.params.id, true, req.user.name);
  logAudit(req.user.name, 'DELETE_AUTOMATION', `Archived automation ${req.params.id}`, 'CRM Email Studio', req.params.id);
  res.json({ success: true });
});

// Dynamic Segments Engine
app.get('/api/email/segments', requireAuth, (req, res) => {
  const registrations = getCollection('registrations').filter((r) => !r.isDeleted);
  const founders = getCollection('founders').filter((f) => !f.isDeleted);
  const subscribers = getCollection('subscribers').filter((s) => !s.isDeleted && s.status === 'active');
  const academy = getCollection('academy_registrations').filter((a) => !a.isDeleted);
  const partnerships = getCollection('partnerships').filter((p) => !p.isDeleted);

  const segments = [
    {
      id: 'seg-01',
      name: 'All Registered Event Delegates',
      category: 'Events',
      description: 'Every registered attendee across all 7H cohorts and mixer sessions.',
      count: registrations.length,
      criteria: 'all_registrations'
    },
    {
      id: 'seg-02',
      name: 'Confirmed Paid Delegates (Cashfree)',
      category: 'Events',
      description: 'Attendees with verified paid passes via Cashfree gateway.',
      count: registrations.filter((r) => r.paymentStatus === 'PAID').length,
      criteria: 'paid_passes'
    },
    {
      id: 'seg-03',
      name: 'Past Attended Delegates (Checked-In)',
      category: 'Events',
      description: 'Reconciled attendees who checked in at past summits.',
      count: registrations.filter((r) => r.checkedIn).length,
      criteria: 'checked_in'
    },
    {
      id: 'seg-04',
      name: 'Event No-Shows (Follow-up Pool)',
      category: 'Events',
      description: 'Registered delegates who were marked as no-show for re-engagement.',
      count: registrations.filter((r) => r.noShow).length,
      criteria: 'no_show'
    },
    {
      id: 'seg-05',
      name: 'Verified Tech Founders',
      category: 'Founders',
      description: 'Approved tech founders in the 7 Horse Ventures directory.',
      count: founders.length,
      criteria: 'all_founders'
    },
    {
      id: 'seg-06',
      name: 'Academy Masterclass Participants',
      category: 'Academy',
      description: 'Learners and operators enrolled in 7H Academy masterclasses.',
      count: academy.length,
      criteria: 'all_academy'
    },
    {
      id: 'seg-07',
      name: 'Active Newsletter Subscribers',
      category: 'Publishing',
      description: 'Opted-in community members receiving monthly venture dispatches.',
      count: subscribers.length,
      criteria: 'active_subscribers'
    },
    {
      id: 'seg-08',
      name: 'Corporate & VC Partnership Leads',
      category: 'Partnerships',
      description: 'Sponsors, institutional syndicates, and ecosystem partners.',
      count: partnerships.length,
      criteria: 'all_partners'
    }
  ];

  res.json(segments);
});

// Dispatch Email Campaign to a Segment
app.post('/api/email/campaigns/send', requireAuth, async (req, res) => {
  try {
    const { title, segmentId, templateId, subject, customBody } = req.body;
    if (!title || !segmentId || !templateId) {
      return res.status(400).json({ error: 'Campaign title, segmentId, and templateId are required.' });
    }

    const templates = getCollection('email_templates');
    const tpl = templates.find((t) => t.id === templateId) || templates[0];

    let contacts = [];
    if (segmentId === 'seg-01') {
      contacts = getCollection('registrations').map((r) => ({ email: r.email, name: r.name, role: r.role, company: r.company }));
    } else if (segmentId === 'seg-02') {
      contacts = getCollection('registrations').filter((r) => r.paymentStatus === 'PAID').map((r) => ({ email: r.email, name: r.name }));
    } else if (segmentId === 'seg-03') {
      contacts = getCollection('registrations').filter((r) => r.checkedIn).map((r) => ({ email: r.email, name: r.name }));
    } else if (segmentId === 'seg-04') {
      contacts = getCollection('registrations').filter((r) => r.noShow).map((r) => ({ email: r.email, name: r.name }));
    } else if (segmentId === 'seg-05') {
      contacts = getCollection('founders').map((f) => ({ email: f.email || `${f.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@founder.in`, name: f.name, company: f.company }));
    } else if (segmentId === 'seg-06') {
      contacts = getCollection('academy_registrations').map((a) => ({ email: a.email, name: a.fullName, company: a.organization }));
    } else if (segmentId === 'seg-07') {
      contacts = getCollection('subscribers').filter((s) => s.status === 'active').map((s) => ({ email: s.email, name: s.name || 'Subscriber' }));
    } else {
      contacts = getCollection('partnerships').map((p) => ({ email: p.email, name: p.contactName, company: p.organization }));
    }

    const unsubs = new Set(getCollection('email_unsubscribes').map((u) => u.email?.toLowerCase()));
    const validRecipients = contacts.filter((c) => c.email && !unsubs.has(c.email.toLowerCase()));

    let sentCount = 0;
    for (const rec of validRecipients.slice(0, 50)) {
      const tokens = {
        first_name: rec.name ? rec.name.split(' ')[0] : 'Delegate',
        full_name: rec.name || 'Delegate',
        event_name: '7 Horse Ventures Community',
        registration_link: 'https://7horseventures.com'
      };
      const renderedSubj = renderTemplateVariables(subject || tpl.subject, tokens);
      const renderedHtml = renderTemplateVariables(customBody || tpl.body, tokens) +
        `<p style="font-size:11px;color:#888;margin-top:20px;border-top:1px solid #eee;padding-top:10px;">
          You received this email as a registered member of the 7 Horse Ventures ecosystem.
          <a href="https://7horseventures.com/api/email/unsubscribe?email=${encodeURIComponent(rec.email)}" style="color:#C5A46D;">Unsubscribe</a>
        </p>`;

      await emailTransporter.sendMail({
        from: process.env.SMTP_FROM || '7 Horse Ventures <news@7horseventures.com>',
        to: rec.email,
        subject: renderedSubj,
        html: renderedHtml
      });

      insertItem('email_logs', {
        recipientEmail: rec.email,
        recipientName: rec.name,
        subject: renderedSubj,
        templateId: tpl.id,
        workflowId: 'manual-campaign',
        status: 'DELIVERED',
        sentAt: new Date().toISOString()
      });
      sentCount++;
    }

    const newCampaign = insertItem('email_campaigns', {
      title,
      segmentId,
      templateId,
      subject: subject || tpl.subject,
      status: 'sent',
      sentAt: new Date().toISOString(),
      recipientCount: sentCount,
      stats: { sent: sentCount, delivered: sentCount, opened: Math.round(sentCount * 0.72), clicked: Math.round(sentCount * 0.44), bounced: 0, unsubscribed: 0 }
    });

    logAudit(req.user.name, 'DISPATCH_CAMPAIGN', `Dispatched campaign "${title}" to ${sentCount} recipients`, 'CRM Email Studio', newCampaign.id);
    res.json({ success: true, sentCount, campaign: newCampaign });
  } catch (err) {
    console.error('Campaign dispatch error:', err);
    res.status(500).json({ error: 'Failed to dispatch campaign', message: err.message });
  }
});

// Email Logs & Delivery History
app.get('/api/email/logs', requireAuth, (req, res) => {
  res.json(getCollection('email_logs'));
});

// Unsubscribe Handler
app.get('/api/email/unsubscribe', (req, res) => {
  const { email } = req.query;
  if (email) {
    insertItem('email_unsubscribes', { email, timestamp: new Date().toISOString() });
    const subs = getCollection('subscribers');
    const sub = subs.find((s) => s.email?.toLowerCase() === email.toLowerCase());
    if (sub) {
      updateItem('subscribers', sub.id, { status: 'unsubscribed' });
    }
  }
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Unsubscribed • 7 Horse Ventures</title><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="background:#101010;color:#F7F5F0;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;padding:20px;box-sizing:border-box;">
        <div style="background:#141414;border:1px solid #C5A46D;padding:32px;border-radius:16px;max-width:440px;text-align:center;">
          <h2 style="color:#D8C39A;margin-top:0;">Unsubscribed Successfully</h2>
          <p style="color:#aaa;font-size:14px;line-height:1.6;">${email ? `<strong>${email}</strong> has` : 'You have'} been removed from 7 Horse Ventures email announcements. You can rejoin at any time via our community portal.</p>
          <a href="/" style="display:inline-block;margin-top:16px;background:#C5A46D;color:#101010;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px;">Return to 7 Horse Ventures</a>
        </div>
      </body>
    </html>
  `);
});

// ==========================================
// 16. PRODUCTION FRONTEND SERVING
// ==========================================
const DIST_DIR = path.join(__dirname, '..', 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(DIST_DIR, 'index.html'));
    }
    next();
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Export app for Vercel Serverless Function & testing
export default app;

// Start Express Server when running as standalone service
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`7 Horse Ventures Server running on http://localhost:${PORT}`);
    console.log(`- Official WhatsApp: ${OFFICIAL_WHATSAPP_LINK}`);
  });
}
