import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import {
  getCollection,
  setCollection,
  insertItem,
  updateItem,
  deleteItem,
  getDatabase,
  saveDatabase,
  createBackup,
  getDatabaseInfo
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || '7h-v-secret-jwt-key-2026-production-grade';
const OFFICIAL_WHATSAPP_LINK = 'https://chat.whatsapp.com/IzTObDPm8pw80Hw811RJvC?s=cl&p=a&iam=2';

// Uploads directory
const UPLOADS_DIR = path.join(__dirname, 'uploads');
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
function logAudit(user, action, details) {
  insertItem('audit_logs', {
    user: user || 'Ecosystem Admin',
    action,
    details,
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
      avatar: user.avatar
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
    avatar: user.avatar
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
    status: u.status,
    avatar: u.avatar,
    createdAt: u.createdAt
  }));
  res.json(users);
});

app.post('/api/users', requireAdmin, (req, res) => {
  const rawPasscode = req.body.passcode || '7H-Member-2026';
  const newUser = insertItem('users', {
    ...req.body,
    passcode: hashPassword(rawPasscode),
    passwordHash: hashPassword(rawPasscode)
  });
  logAudit(req.user.name, 'Create Team User', `Added user ${newUser.name} with role ${newUser.role}`);
  res.json({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role });
});

app.put('/api/users/:id', requireAdmin, (req, res) => {
  const updates = { ...req.body };
  if (updates.passcode) {
    updates.passcode = hashPassword(updates.passcode);
    updates.passwordHash = updates.passcode;
  }
  const updated = updateItem('users', req.params.id, updates);
  res.json(updated);
});

app.delete('/api/users/:id', requireAdmin, (req, res) => {
  deleteItem('users', req.params.id);
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
    registeredAt: new Date().toISOString()
  });

  if (req.body.eventId) {
    const events = getCollection('events');
    const evt = events.find((e) => e.id === req.body.eventId);
    if (evt) {
      updateItem('events', evt.id, { registeredCount: (evt.registeredCount || 0) + 1 });
    }
  }
  res.json(newReg);
});

app.put('/api/registrations/:id/checkin', requireAuth, (req, res) => {
  const current = getCollection('registrations').find((r) => r.id === req.params.id);
  const updated = updateItem('registrations', req.params.id, { checkedIn: !current?.checkedIn });
  res.json(updated);
});

app.delete('/api/registrations/:id', requireAuth, (req, res) => {
  deleteItem('registrations', req.params.id);
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

  res.json({ success: true, registration: newReg });
});

app.delete('/api/academy-registrations/:id', requireAuth, (req, res) => {
  deleteItem('academy_registrations', req.params.id);
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
  const updated = updateItem('founders', req.params.id, req.body);
  res.json(updated);
});

app.delete('/api/founders/:id', requireAuth, (req, res) => {
  deleteItem('founders', req.params.id);
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

// Start Express Server
app.listen(PORT, () => {
  console.log(`7 Horse Ventures Server running on http://localhost:${PORT}`);
  console.log(`- Database: Persistent Atomic JSON Engine (${path.join(__dirname, 'data', 'database.json')})`);
  console.log(`- Official WhatsApp: ${OFFICIAL_WHATSAPP_LINK}`);
});
