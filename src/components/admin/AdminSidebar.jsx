import React from 'react';
import {
  LayoutDashboard,
  Image,
  Calendar,
  Users,
  BookOpen,
  Newspaper,
  UserCheck,
  Mail,
  ListFilter,
  Rocket,
  Compass,
  FileText,
  Building2,
  Inbox,
  FolderOpen,
  FolderArchive,
  Search,
  BarChart3,
  Shield,
  Settings,
  Plug,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Database
} from 'lucide-react';
import Logo from '../Logo';

export default function AdminSidebar({ activeTab, setActiveTab, currentUser, onLogout, onGoPublic }) {
  const navSections = [
    {
      label: 'Core Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 }
      ]
    },
    {
      label: 'Website & Visuals',
      items: [
        { id: 'visual_manager', label: 'Website Content & Images', icon: Image },
        { id: 'media_library', label: 'Media Library', icon: FolderOpen },
        { id: 'website_settings', label: 'Website Settings', icon: Settings },
        { id: 'seo_settings', label: 'SEO Settings', icon: Search }
      ]
    },
    {
      label: 'Events & Attendees',
      items: [
        { id: 'events', label: 'Events Manager', icon: Calendar },
        { id: 'registrations', label: 'Attendee Roster', icon: Users }
      ]
    },
    {
      label: 'Academy & Education',
      items: [
        { id: 'academy_sessions', label: 'Academy Sessions & Attendees', icon: GraduationCap }
      ]
    },
    {
      label: 'Publishing & Media',
      items: [
        { id: 'articles', label: 'Blog & Insights', icon: BookOpen },
        { id: 'news', label: 'Startup News', icon: Newspaper },
        { id: 'founder_stories', label: 'Founder Stories', icon: UserCheck },
        { id: 'newsletter', label: 'Newsletter Campaigns', icon: Mail },
        { id: 'subscribers', label: 'Subscribers List', icon: ListFilter }
      ]
    },
    {
      label: 'Ecosystem Directories',
      items: [
        { id: 'founders_dir', label: 'Founder Directory', icon: UserCheck },
        { id: 'startups_dir', label: 'Startup Directory', icon: Rocket },
        { id: 'opportunities', label: 'Opportunity Board', icon: Compass },
        { id: 'resources', label: 'Resource Library', icon: FolderArchive }
      ]
    },
    {
      label: 'Pipeline & CRM',
      items: [
        { id: 'crm_email_studio', label: 'CRM Email Studio', icon: Mail },
        { id: 'pitch_applications', label: 'Pitch Applications', icon: FileText },
        { id: 'partnerships_crm', label: 'Partnership CRM', icon: Building2 },
        { id: 'enquiries', label: 'Contact Enquiries', icon: Inbox }
      ]
    },
    {
      label: 'Governance & Team',
      items: [
        { id: 'team_permissions', label: 'Team & Permissions', icon: Shield },
        { id: 'database_admin', label: 'Database & Backups', icon: Database },
        { id: 'integrations', label: 'Integrations', icon: Plug }
      ]
    }
  ];

  const isSuperAdmin = currentUser?.role === 'Super Admin' || currentUser?.assignedModules?.includes('*') || !currentUser?.assignedModules;
  const allowed = currentUser?.assignedModules || ['*'];

  const filteredNavSections = navSections
    .map((sec) => ({
      ...sec,
      items: sec.items.filter((item) => {
        if (item.id === 'dashboard') return true;
        if (isSuperAdmin) return true;
        return allowed.includes(item.id);
      })
    }))
    .filter((sec) => sec.items.length > 0);

  return (
    <aside className="w-64 bg-[#101010] text-[#E8E5DF] border-r border-[#262626] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-[#222222] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo variant="light" size="small" />
            <span className="text-[10px] font-mono text-[#D8C39A] bg-[#C5A46D]/15 px-1.5 py-0.5 rounded border border-[#C5A46D]/30">
              CMS 2.0
            </span>
          </div>
        </div>

        {/* User Badge */}
        <div className="p-3 mx-3 my-2 bg-[#181818] rounded-xl border border-[#2a2a2a] flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={currentUser?.name}
              className="w-7 h-7 rounded-full object-cover border border-[#C5A46D]/50 shrink-0"
            />
            <div className="truncate">
              <span className="text-xs font-bold text-white block truncate leading-tight font-heading">
                {currentUser?.name || 'Administrator'}
              </span>
              <span className="text-[10px] font-mono text-[#D8C39A] block leading-tight">
                {currentUser?.role || 'Super Admin'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-4 text-xs">
          {filteredNavSections.map((sec) => (
            <div key={sec.label} className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-medium text-stone-500 font-mono">
                {sec.label}
              </div>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const IconComp = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#C5A46D] text-[#101010] font-bold shadow-xs'
                          : 'text-stone-400 hover:text-white hover:bg-[#181818]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-[#101010]' : 'text-[#C5A46D]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3 h-3 text-[#101010]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-[#222222] space-y-2">
        <button
          onClick={onGoPublic}
          className="w-full py-2 px-3 bg-[#181818] hover:bg-[#222222] border border-[#2e2e2e] text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
        >
          <span>View Public Website</span>
          <ExternalLink className="w-3 h-3 text-[#C5A46D]" />
        </button>
        <button
          onClick={onLogout}
          className="w-full py-1.5 px-3 text-stone-400 hover:text-rose-400 text-xs font-semibold cursor-pointer text-center transition-colors"
        >
          Sign Out of Console
        </button>
      </div>
    </aside>
  );
}
