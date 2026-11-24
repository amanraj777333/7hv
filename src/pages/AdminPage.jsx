import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import AdminSidebar from '../components/admin/AdminSidebar';

// CMS Modules
import DashboardModule from '../components/admin/DashboardModule';
import VisualManagerModule from '../components/admin/VisualManagerModule';
import MediaLibraryModule from '../components/admin/MediaLibraryModule';
import EventsAdminModule from '../components/admin/EventsAdminModule';
import RegistrationsAdminModule from '../components/admin/RegistrationsAdminModule';
import AcademyAdminModule from '../components/admin/AcademyAdminModule';
import DatabaseAdminModule from '../components/admin/DatabaseAdminModule';
import ArticlesAdminModule from '../components/admin/ArticlesAdminModule';
import NewsletterAdminModule from '../components/admin/NewsletterAdminModule';
import SubscribersAdminModule from '../components/admin/SubscribersAdminModule';
import DirectoriesAdminModule from '../components/admin/DirectoriesAdminModule';
import PitchApplicationsAdminModule from '../components/admin/PitchApplicationsAdminModule';
import PartnershipsCrmModule from '../components/admin/PartnershipsCrmModule';
import EnquiriesAdminModule from '../components/admin/EnquiriesAdminModule';
import ResourcesAdminModule from '../components/admin/ResourcesAdminModule';
import SeoSettingsModule from '../components/admin/SeoSettingsModule';
import AnalyticsAdminModule from '../components/admin/AnalyticsAdminModule';
import TeamPermissionsModule from '../components/admin/TeamPermissionsModule';
import IntegrationsModule from '../components/admin/IntegrationsModule';
import WebsiteSettingsModule from '../components/admin/WebsiteSettingsModule';
import EmailStudioModule from '../components/admin/EmailStudioModule';

import { Lock, LogOut, ExternalLink, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function AdminPage() {
  const { currentUser, login, logout, navigate, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [passcode, setPasscode] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [authError, setAuthError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const success = await login(passcode, emailInput);
    if (!success) {
      setAuthError('Invalid administrator credentials. Please check your passcode.');
    }
  };

  // If not authenticated, render secure authentication modal
  if (!currentUser) {
    return (
      <div className="min-h-[85vh] bg-[#0c0c0c] flex items-center justify-center p-4">
        <SEO
          title="Administrative Operations Console | 7 Horse Ventures"
          description="Restricted ecosystem administration portal."
        />
        <div className="bg-[#141414] border border-[#242424] rounded-2xl w-full max-w-md p-8 relative overflow-hidden">
          {/* Subtle Accent Hairline */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-[#C5A46D]" />

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center text-[#C5A46D] mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-semibold text-white tracking-tight">Operations Console</h1>
            <p className="text-xs text-stone-400 mt-1 max-w-xs leading-relaxed">
              7 Horse Ventures ecosystem management suite. Enter authorized credentials to continue.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            {authError && (
              <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-lg text-red-300 text-xs text-center">
                {authError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-stone-300 font-medium">Administrator Email (Optional)</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@7horseventures.com"
                className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-stone-100 focus:border-[#C5A46D] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-stone-300 font-medium">Passcode *</label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (default: 7horse2026)"
                className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-stone-100 focus:border-[#C5A46D] outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] font-medium text-xs rounded-lg transition-colors cursor-pointer mt-2"
            >
              Sign in to console
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#222222] text-center">
            <button
              onClick={() => navigate('/')}
              className="text-[11px] text-stone-500 hover:text-stone-300 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>← Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active module router
  const renderActiveModule = () => {
    const isSuperAdmin = currentUser?.role === 'Super Admin' || currentUser?.assignedModules?.includes('*') || !currentUser?.assignedModules;
    const allowed = currentUser?.assignedModules || ['*'];
    if (activeTab !== 'dashboard' && !isSuperAdmin && !allowed.includes(activeTab)) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-[#141414] border border-red-900/40 rounded-xl my-8">
          <ShieldAlert className="w-12 h-12 text-red-400 mb-3" />
          <h3 className="text-lg font-bold text-white font-serif">Access Restricted</h3>
          <p className="text-xs text-stone-400 max-w-md mt-1 mb-4">
            You do not have administrative authorization to access the <strong>{activeTab}</strong> module. Please contact your Super Administrator to request role access.
          </p>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-4 py-2 bg-[#C5A46D] text-[#101010] text-xs font-bold rounded-lg cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardModule setActiveTab={setActiveTab} />;
      case 'crm_email_studio':
        return <EmailStudioModule />;
      case 'visual_manager':
        return <VisualManagerModule />;
      case 'media_library':
        return <MediaLibraryModule />;
      case 'website_settings':
        return <WebsiteSettingsModule />;
      case 'seo_settings':
        return <SeoSettingsModule />;
      case 'events':
        return <EventsAdminModule />;
      case 'registrations':
        return <RegistrationsAdminModule />;
      case 'academy_sessions':
        return <AcademyAdminModule />;
      case 'database_admin':
        return <DatabaseAdminModule />;
      case 'articles':
        return <ArticlesAdminModule defaultType="blog" />;
      case 'news':
        return <ArticlesAdminModule defaultType="news" />;
      case 'founder_stories':
        return <ArticlesAdminModule defaultType="founder_story" />;
      case 'newsletter':
        return <NewsletterAdminModule />;
      case 'subscribers':
        return <SubscribersAdminModule />;
      case 'founders_dir':
        return <DirectoriesAdminModule initialTab="founders" />;
      case 'startups_dir':
        return <DirectoriesAdminModule initialTab="startups" />;
      case 'opportunities':
        return <DirectoriesAdminModule initialTab="opportunities" />;
      case 'resources':
        return <ResourcesAdminModule />;
      case 'pitch_applications':
        return <PitchApplicationsAdminModule />;
      case 'partnerships_crm':
        return <PartnershipsCrmModule />;
      case 'enquiries':
        return <EnquiriesAdminModule />;
      case 'analytics':
        return <AnalyticsAdminModule />;
      case 'team_permissions':
        return <TeamPermissionsModule />;
      case 'integrations':
        return <IntegrationsModule />;
      default:
        return <DashboardModule setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#E8E5DF] flex flex-col md:flex-row antialiased">
      <SEO
        title="Administrative Operations Console | 7 Horse Ventures"
        description="7 Horse Ventures digital ecosystem operations console."
      />

      {/* 22-Module Admin Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={logout}
        onGoPublic={() => navigate('/')}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Operational Bar */}
        <header className="sticky top-0 z-30 bg-[#121212]/95 backdrop-blur-md border-b border-[#242424] px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#C5A46D] hidden sm:inline">
              Module:
            </span>
            <span className="text-sm font-semibold text-white capitalize">
              {activeTab.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-semibold px-3 py-1.5 rounded bg-[#1e1e1e] hover:bg-[#282828] text-stone-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer border border-[#333333]"
            >
              <span>View Live Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C5A46D]" />
            </button>
            <button
              onClick={logout}
              className="text-xs font-semibold px-3 py-1.5 rounded bg-red-950/40 hover:bg-red-900/50 text-red-300 transition-colors flex items-center gap-1.5 cursor-pointer border border-red-900/40"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Dynamic CMS Body with Snappy Micro-Transitions */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          <div key={activeTab} className="animate-[pageFade_150ms_ease_forwards]">
            {renderActiveModule()}
          </div>
        </main>
      </div>
    </div>
  );
}
