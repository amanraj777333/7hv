import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_EVENTS } from '../data/initialData';
import {
  startSmoothingVoice,
  stopSmoothingVoice,
  isSmoothingVoiceActive
} from '../utils/soothingVoice';

const AppContext = createContext();

const API_BASE = '/api';
export const OFFICIAL_WHATSAPP_LINK = 'https://chat.whatsapp.com/IzTObDPm8pw80Hw811RJvC?s=cl&p=a&iam=2';

export function AppProvider({ children }) {
  // 1. Client-side Routing with Browser History Support
  const getInitialPath = () => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      return pathname && pathname !== '' ? pathname : '/';
    }
    return '/';
  };

  const [currentPath, setCurrentPath] = useState(getInitialPath);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    if (path === currentPath) return;
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setCurrentPath(path);
  };

  // 2. Permanent Black Theme (Warm Gold & Charcoal Brand Identity)
  const [theme] = useState('dark');

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('7h_theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    // Locked to Black Theme per brand standards
  };

  // 2b. Soothing Voice Audio Guide State
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);

  const toggleVoice = () => {
    if (isVoicePlaying) {
      stopSmoothingVoice();
      setIsVoicePlaying(false);
    } else {
      const started = startSmoothingVoice(
        () => setIsVoicePlaying(true),
        () => setIsVoicePlaying(false)
      );
      if (started) {
        setIsVoicePlaying(true);
      }
    }
  };

  const stopVoice = () => {
    stopSmoothingVoice();
    setIsVoicePlaying(false);
  };

  // 3. Central Media & Visual Mapping State
  const [mediaMappings, setMediaMappings] = useState({});
  const [mediaLibrary, setMediaLibrary] = useState([]);

  // 4. Platform Data State
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [registrations, setRegistrations] = useState([]);
  const [academySessions, setAcademySessions] = useState([]);
  const [academyRegistrations, setAcademyRegistrations] = useState([]);
  const [articles, setArticles] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [founders, setFounders] = useState([]);
  const [startups, setStartups] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [pitchApplications, setPitchApplications] = useState([]);
  const [partnerships, setPartnerships] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [resources, setResources] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [teamUsers, setTeamUsers] = useState([]);
  const [websiteSettings, setWebsiteSettings] = useState({
    brandName: '7 Horse Ventures',
    tagline: 'Connect. Build. Grow. Scale.',
    contactEmail: 'connect@7horseventures.com',
    contactPhone: '+91 124 490 XXXX',
    whatsappCommunityPlaceholder: OFFICIAL_WHATSAPP_LINK,
    socialLinks: {
      linkedin: 'https://linkedin.com/company/7horseventures',
      twitter: 'https://x.com/7horseventures',
      instagram: 'https://instagram.com/7horseventures'
    },
    announcement: {
      active: true,
      text: '2026 Founder Cohorts & Masterclasses: Registrations are now open.',
      link: '/academy'
    },
    homepageCtas: {
      primaryText: 'Explore Events',
      primaryLink: '/events',
      secondaryText: 'Join Us',
      secondaryLink: '/community'
    },
    sectionVisibility: {
      hero: true,
      intro: true,
      audience: true,
      ecosystem: true,
      flagship: true,
      differentiators: true,
      partnerships: true,
      vision: true,
      cta: true
    }
  });

  // Admin Auth State & Token Management
  const [authToken, setAuthToken] = useState(() => {
    try {
      return localStorage.getItem('7h_admin_token') || null;
    } catch {
      return null;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('7h_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Modals State
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [selectedEventModal, setSelectedEventModal] = useState(null);

  // Toast System
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Helper for authenticated fetch headers
  const getAuthHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
  };

  // Fetch all data from real backend
  const refreshAllData = useCallback(async () => {
    try {
      const authHeaders = authToken ? { Authorization: `Bearer ${authToken}` } : {};

      const [
        mapRes,
        medRes,
        evtRes,
        regRes,
        acadRes,
        acadRegRes,
        artRes,
        subRes,
        nlRes,
        fndRes,
        stpRes,
        oppRes,
        paRes,
        partRes,
        enqRes,
        resRes,
        settRes,
        anRes,
        usrRes
      ] = await Promise.allSettled([
        fetch(`${API_BASE}/media-mappings`).then((r) => r.json()),
        fetch(`${API_BASE}/media`).then((r) => r.json()),
        fetch(`${API_BASE}/events`).then((r) => r.json()),
        fetch(`${API_BASE}/registrations`, { headers: authHeaders }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${API_BASE}/academy-sessions`).then((r) => r.json()),
        fetch(`${API_BASE}/academy-registrations`, { headers: authHeaders }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${API_BASE}/articles`).then((r) => r.json()),
        fetch(`${API_BASE}/subscribers`, { headers: authHeaders }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${API_BASE}/newsletters`, { headers: authHeaders }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${API_BASE}/founders`).then((r) => r.json()),
        fetch(`${API_BASE}/startups`).then((r) => r.json()),
        fetch(`${API_BASE}/opportunities`).then((r) => r.json()),
        fetch(`${API_BASE}/pitch-applications`, { headers: authHeaders }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${API_BASE}/partnerships`, { headers: authHeaders }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${API_BASE}/enquiries`, { headers: authHeaders }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${API_BASE}/resources`).then((r) => r.json()),
        fetch(`${API_BASE}/settings`).then((r) => r.json()),
        fetch(`${API_BASE}/analytics`).then((r) => r.json()),
        fetch(`${API_BASE}/users`, { headers: authHeaders }).then((r) => (r.ok ? r.json() : []))
      ]);

      if (mapRes.status === 'fulfilled' && Array.isArray(mapRes.value)) {
        const mapObj = {};
        mapRes.value.forEach((m) => {
          mapObj[m.key] = m;
        });
        setMediaMappings(mapObj);
      }
      if (medRes.status === 'fulfilled') setMediaLibrary(medRes.value);
      if (evtRes.status === 'fulfilled') setEvents(evtRes.value);
      if (regRes.status === 'fulfilled') setRegistrations(regRes.value);
      if (acadRes.status === 'fulfilled') setAcademySessions(acadRes.value);
      if (acadRegRes.status === 'fulfilled') setAcademyRegistrations(acadRegRes.value);
      if (artRes.status === 'fulfilled') setArticles(artRes.value);
      if (subRes.status === 'fulfilled') setSubscribers(subRes.value);
      if (nlRes.status === 'fulfilled') setNewsletters(nlRes.value);
      if (fndRes.status === 'fulfilled') setFounders(fndRes.value);
      if (stpRes.status === 'fulfilled') setStartups(stpRes.value);
      if (oppRes.status === 'fulfilled') setOpportunities(oppRes.value);
      if (paRes.status === 'fulfilled') setPitchApplications(paRes.value);
      if (partRes.status === 'fulfilled') setPartnerships(partRes.value);
      if (enqRes.status === 'fulfilled') setEnquiries(enqRes.value);
      if (resRes.status === 'fulfilled') setResources(resRes.value);
      if (settRes.status === 'fulfilled' && settRes.value) {
        setWebsiteSettings({
          ...settRes.value,
          whatsappCommunityPlaceholder: OFFICIAL_WHATSAPP_LINK
        });
      }
      if (anRes.status === 'fulfilled') setAnalytics(anRes.value);
      if (usrRes.status === 'fulfilled') setTeamUsers(usrRes.value);
    } catch (err) {
      console.error('Error fetching CMS backend data:', err);
    }
  }, [authToken]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Image Resolution Helper
  const getImage = useCallback(
    (key, fallbackUrl, fallbackAlt = '7 Horse Ventures asset') => {
      const mapping = mediaMappings[key];
      if (mapping && mapping.url) {
        return {
          url: mapping.url,
          alt: mapping.alt || fallbackAlt,
          position: mapping.position || 'center',
          fit: mapping.fit || 'cover'
        };
      }
      return {
        url: fallbackUrl,
        alt: fallbackAlt,
        position: 'center',
        fit: 'cover'
      };
    },
    [mediaMappings]
  );

  // Update Media Mapping in real backend
  const updateMediaMapping = async (key, updateData) => {
    try {
      const res = await fetch(`${API_BASE}/media-mappings/${encodeURIComponent(key)}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...updateData,
          adminUser: currentUser?.name || 'Administrator'
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setMediaMappings((prev) => ({ ...prev, [key]: updated }));
        showToast(`Image asset for ${key} updated successfully!`, 'success');
        return updated;
      }
    } catch (err) {
      console.error('Update image mapping failed:', err);
      showToast('Failed to update image', 'error');
    }
    return null;
  };

  // Revert Media Mapping
  const revertMediaMapping = async (key) => {
    try {
      const res = await fetch(`${API_BASE}/media-mappings/${encodeURIComponent(key)}/revert`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ adminUser: currentUser?.name || 'Administrator' })
      });
      if (res.ok) {
        const reverted = await res.json();
        setMediaMappings((prev) => ({ ...prev, [key]: reverted }));
        showToast(`Image reverted to previous version`, 'info');
        return reverted;
      } else {
        const err = await res.json();
        showToast(err.error || 'Cannot revert', 'error');
      }
    } catch (err) {
      console.error('Revert failed:', err);
      showToast('Revert failed', 'error');
    }
    return null;
  };

  // Upload file to Media Library
  const uploadMediaFile = async (file, meta = {}) => {
    const formData = new FormData();
    formData.append('image', file);
    if (meta.title) formData.append('title', meta.title);
    if (meta.alt) formData.append('alt', meta.alt);
    if (meta.category) formData.append('category', meta.category);

    const headers = {};
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    const res = await fetch(`${API_BASE}/media/upload`, {
      method: 'POST',
      headers,
      body: formData
    });
    if (res.ok) {
      const item = await res.json();
      setMediaLibrary((prev) => [item, ...prev]);
      showToast('Media uploaded to library', 'success');
      return item;
    }
    throw new Error('Upload failed');
  };

  // Academy Registration Submission Handler
  const registerAcademy = async (registrationData) => {
    try {
      const res = await fetch(`${API_BASE}/academy-registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
      });
      if (res.ok) {
        const data = await res.json();
        setAcademyRegistrations((prev) => [data.registration, ...prev]);
        showToast('Registration confirmed! Check your email for session access details.', 'success');
        refreshAllData();
        return { success: true, data: data.registration };
      } else {
        const err = await res.json();
        showToast(err.error || 'Registration could not be completed.', 'error');
        return { success: false, error: err.error };
      }
    } catch (err) {
      console.error('Academy registration error:', err);
      showToast('Connection error. Please try again.', 'error');
      return { success: false, error: err.message };
    }
  };

  // General Submission Handler
  const addSubmission = async (type, data) => {
    try {
      if (type.includes('Pitch') || type.includes('Startup')) {
        await fetch(`${API_BASE}/pitch-applications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            startupName: data.companyName || data.startupName,
            founderName: data.founderName || data.name,
            email: data.email,
            phone: data.phone,
            sector: data.sector || data.industry,
            stage: data.stage,
            ask: data.targetRaise || data.ask,
            revenue: data.arrTraction || data.revenue,
            deckUrl: data.pitchDeckUrl || data.deckUrl,
            elevatorPitch: data.problemSolution || data.elevatorPitch,
            submittedAt: new Date().toISOString()
          })
        });
      } else {
        await fetch(`${API_BASE}/enquiries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name || data.founderName || 'Founder',
            email: data.email,
            phone: data.phone,
            category: type,
            subject: `${type} Submission`,
            message: typeof data === 'string' ? data : JSON.stringify(data, null, 2),
            status: 'new',
            createdAt: new Date().toISOString()
          })
        });
      }

      refreshAllData();
      showToast('Application submitted successfully!', 'success');
    } catch (err) {
      console.error('Submission error:', err);
      showToast('Submission recorded', 'success');
    }
  };

  // Settings Updater
  const updateSettings = async (updates) => {
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...websiteSettings,
          ...updates
        })
      });
      if (res.ok) {
        const saved = await res.json();
        setWebsiteSettings(saved);
        showToast('Settings updated', 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Authentication Helpers
  const login = async (passcode, email) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode, email })
      });
      const data = await res.json();
      if (data.success && data.user && data.token) {
        setCurrentUser(data.user);
        setAuthToken(data.token);
        localStorage.setItem('7h_admin_user', JSON.stringify(data.user));
        localStorage.setItem('7h_admin_token', data.token);
        showToast(`Signed in as ${data.user.role}`, 'success');
        setSignInModalOpen(false);
        return true;
      } else {
        showToast(data.message || 'Invalid credentials.', 'error');
      }
    } catch (err) {
      console.error('Login error:', err);
      showToast('Network error during authentication.', 'error');
    }
    return false;
  };

  const logout = () => {
    if (authToken) {
      fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      }).catch(() => {});
    }
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('7h_admin_user');
    localStorage.removeItem('7h_admin_token');
    showToast('Signed out of Operations Console', 'info');
  };

  // Safe WhatsApp Opener helper
  const openWhatsAppCommunity = () => {
    window.open(OFFICIAL_WHATSAPP_LINK, '_blank', 'noopener,noreferrer');
  };

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        // Theme (Permanently locked to Black Theme)
        theme: 'dark',
        setTheme: () => {},
        toggleTheme,
        // Soothing Voice Audio Guide
        isVoicePlaying,
        toggleVoice,
        stopVoice,
        // Official WhatsApp Link & Helper
        officialWhatsAppLink: OFFICIAL_WHATSAPP_LINK,
        openWhatsAppCommunity,
        // Modals
        signInModalOpen,
        setSignInModalOpen,
        selectedEventModal,
        setSelectedEventModal,
        // Media Management
        mediaMappings,
        mediaLibrary,
        getImage,
        updateMediaMapping,
        revertMediaMapping,
        uploadMediaFile,
        // Events
        events,
        setEvents,
        registrations,
        setRegistrations,
        // Academy Sessions (Req 2)
        academySessions,
        setAcademySessions,
        academyRegistrations,
        setAcademyRegistrations,
        registerAcademy,
        // Articles & Stories
        articles,
        setArticles,
        // Subscribers & Newsletters
        subscribers,
        setSubscribers,
        newsletters,
        setNewsletters,
        // Directories & Opportunities
        founders,
        setFounders,
        startups,
        setStartups,
        opportunities,
        setOpportunities,
        // Private Workflows
        pitchApplications,
        setPitchApplications,
        partnerships,
        setPartnerships,
        enquiries,
        setEnquiries,
        resources,
        setResources,
        // Settings & Analytics
        websiteSettings,
        setWebsiteSettings,
        settings: websiteSettings,
        updateSettings,
        analytics,
        teamUsers,
        setTeamUsers,
        // Auth
        currentUser,
        authToken,
        login,
        logout,
        addSubmission,
        // Utility
        refreshAllData,
        toasts,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
