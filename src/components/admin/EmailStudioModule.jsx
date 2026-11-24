import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Zap,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Play,
  Pause,
  Edit2,
  Trash2,
  Eye,
  Smartphone,
  Monitor,
  Sparkles,
  Search,
  Filter,
  BarChart3,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import AdminModal from './common/AdminModal';
import ConfirmModal from './common/ConfirmModal';

export default function EmailStudioModule() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'campaigns' | 'automations' | 'templates' | 'segments' | 'logs'
  const [metrics, setMetrics] = useState({
    campaignsCount: 0,
    activeAutomationsCount: 0,
    templatesCount: 0,
    totalSent: 0,
    totalDelivered: 0,
    unsubscribedCount: 0,
    deliveryRate: '100%',
    smtpConfigured: false
  });

  const [templates, setTemplates] = useState([]);
  const [automations, setAutomations] = useState([]);
  const [segments, setSegments] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [deliveryLogs, setDeliveryLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    segmentId: 'seg-01',
    templateId: 'tpl-01',
    subject: '',
    customBody: ''
  });

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateForm, setTemplateForm] = useState({
    id: '',
    name: '',
    category: 'Event Booking',
    subject: '',
    body: '',
    variables: ['first_name', 'full_name', 'event_name', 'event_date', 'event_time', 'ticket_reference', 'registration_link']
  });

  const [isTestEmailModalOpen, setIsTestEmailModalOpen] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('admin@7horseventures.com');
  const [testingTemplateId, setTestingTemplateId] = useState('');

  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' | 'mobile'

  const [confirmModalState, setConfirmModalState] = useState({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });

  const token = localStorage.getItem('7h_auth_token') || '';
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  const fetchStudioData = async () => {
    setIsLoading(true);
    try {
      const [ovRes, tplRes, autoRes, segRes, logRes] = await Promise.all([
        fetch('/api/email/studio/overview', { headers: authHeaders }),
        fetch('/api/email/templates', { headers: authHeaders }),
        fetch('/api/email/automations', { headers: authHeaders }),
        fetch('/api/email/segments', { headers: authHeaders }),
        fetch('/api/email/logs', { headers: authHeaders })
      ]);

      if (ovRes.ok) setMetrics(await ovRes.json());
      if (tplRes.ok) setTemplates(await tplRes.json());
      if (autoRes.ok) setAutomations(await autoRes.json());
      if (segRes.ok) setSegments(await segRes.json());
      if (logRes.ok) setDeliveryLogs(await logRes.json());
    } catch (err) {
      console.error('Failed to load email studio data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudioData();
  }, []);

  const handleToggleAutomation = async (id) => {
    try {
      const res = await fetch(`/api/email/automations/${id}/toggle`, {
        method: 'POST',
        headers: authHeaders
      });
      if (res.ok) {
        const updated = await res.json();
        setAutomations((prev) => prev.map((a) => (a.id === id ? updated : a)));
        fetchStudioData();
      }
    } catch (err) {
      alert('Error toggling automation state');
    }
  };

  const handleSendCampaign = async (e) => {
    e.preventDefault();
    if (!campaignForm.title || !campaignForm.segmentId || !campaignForm.templateId) {
      alert('Please fill all required campaign fields.');
      return;
    }

    try {
      const res = await fetch('/api/email/campaigns/send', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(campaignForm)
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Campaign successfully dispatched to ${data.sentCount} recipients!`);
        setIsNewCampaignModalOpen(false);
        fetchStudioData();
      } else {
        alert(data.error || 'Failed to dispatch campaign');
      }
    } catch (err) {
      alert('Error sending campaign: ' + err.message);
    }
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    try {
      const isEdit = Boolean(templateForm.id);
      const url = isEdit ? `/api/email/templates/${templateForm.id}` : '/api/email/templates';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(templateForm)
      });

      if (res.ok) {
        setIsTemplateModalOpen(false);
        fetchStudioData();
      } else {
        alert('Failed to save template');
      }
    } catch (err) {
      alert('Error saving template: ' + err.message);
    }
  };

  const handleSendTestEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/email/templates/test', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          templateId: testingTemplateId,
          testEmail: testEmailAddress
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Test email sent to ${testEmailAddress}! Check your inbox.`);
        setIsTestEmailModalOpen(false);
      } else {
        alert(data.error || 'Failed to send test email');
      }
    } catch (err) {
      alert('Error sending test email: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-serif text-white">CRM Email Studio & Marketing Automation</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#C5A46D]/20 text-[#D8C39A] border border-[#C5A46D]/40">
              Live Engine
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Manage branded email journeys, automated event booking sequences, dynamic audience segments, and real delivery tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setTemplateForm({
                id: '',
                name: '',
                category: 'Event Booking',
                subject: '',
                body: '',
                variables: ['first_name', 'full_name', 'event_name', 'event_date', 'event_time', 'ticket_reference', 'registration_link']
              });
              setIsTemplateModalOpen(true);
            }}
            className="px-3.5 py-2 bg-[#222222] hover:bg-[#2c2c2c] text-stone-200 border border-[#3a3a3a] rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Template</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewCampaignModalOpen(true)}
            className="px-4 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch Campaign</span>
          </button>
        </div>
      </div>

      {/* Primary Studio Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#282828] pb-3 text-xs">
        {[
          { id: 'overview', label: 'Studio Overview', icon: BarChart3 },
          { id: 'automations', label: 'Event Booking Journeys', icon: Zap, count: automations.length },
          { id: 'templates', label: 'Email Templates', icon: FileText, count: templates.length },
          { id: 'segments', label: 'Audience Segments', icon: Users, count: segments.length },
          { id: 'logs', label: 'Delivery History & Logs', icon: Clock, count: deliveryLogs.length }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#C5A46D] text-[#101010]'
                  : 'bg-[#161616] text-stone-400 hover:text-white hover:bg-[#202020]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeTab === tab.id ? 'bg-[#101010] text-[#D8C39A]' : 'bg-[#262626] text-stone-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 bg-[#141414] border border-[#262626] rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-mono text-stone-500 block">Total Sent Dispatches</span>
              <span className="text-2xl font-bold text-white font-mono">{metrics.totalSent}</span>
              <span className="text-[11px] text-emerald-400 block">Delivery Rate: {metrics.deliveryRate}</span>
            </div>
            <div className="p-4 bg-[#141414] border border-[#262626] rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-mono text-stone-500 block">Active Automations</span>
              <span className="text-2xl font-bold text-[#D8C39A] font-mono">{metrics.activeAutomationsCount}</span>
              <span className="text-[11px] text-stone-400 block">Triggered by real event activities</span>
            </div>
            <div className="p-4 bg-[#141414] border border-[#262626] rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-mono text-stone-500 block">Contact Segments</span>
              <span className="text-2xl font-bold text-white font-mono">{segments.length}</span>
              <span className="text-[11px] text-stone-400 block">Connected to real DB records</span>
            </div>
            <div className="p-4 bg-[#141414] border border-[#262626] rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-mono text-stone-500 block">Email Templates</span>
              <span className="text-2xl font-bold text-white font-mono">{templates.length}</span>
              <span className="text-[11px] text-stone-400 block">Executive branded HTML</span>
            </div>
          </div>

          {/* Quick Automations Showcase */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-serif">Event Booking Email Automation Pipeline</h3>
                <p className="text-xs text-stone-400">
                  Every attendee registration automatically executes this sequential lifecycle journey.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('automations')}
                className="text-xs text-[#C5A46D] hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <span>View Full Automation Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-[#181818] border border-[#2c2c2c] rounded-xl space-y-1.5 relative">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-900/40 text-blue-300 border border-blue-700/40">
                  Trigger 1 • Instant
                </span>
                <h4 className="text-xs font-bold text-white">Booking Confirmation Pass</h4>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Sends pass ID, event date, time, venue, and Google Calendar invite immediately upon RSVP.
                </p>
              </div>

              <div className="p-3.5 bg-[#181818] border border-[#2c2c2c] rounded-xl space-y-1.5 relative">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-900/40 text-amber-300 border border-amber-700/40">
                  Trigger 2 • 3d & 1d Prior
                </span>
                <h4 className="text-xs font-bold text-white">Scheduled Reminders</h4>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Sends automated preparation checklists, directions, and gate pass QR previews.
                </p>
              </div>

              <div className="p-3.5 bg-[#181818] border border-[#2c2c2c] rounded-xl space-y-1.5 relative">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-900/40 text-emerald-300 border border-emerald-700/40">
                  Trigger 3 • Attended
                </span>
                <h4 className="text-xs font-bold text-white">Post-Event Thank You</h4>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Sends slidedecks, founder resources, and community WhatsApp invite to reconciled delegates.
                </p>
              </div>

              <div className="p-3.5 bg-[#181818] border border-[#2c2c2c] rounded-xl space-y-1.5 relative">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-stone-800 text-stone-300 border border-stone-700">
                  Trigger 4 • No-Show
                </span>
                <h4 className="text-xs font-bold text-white">No-Show Friendly Follow-up</h4>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Acknowledges absence, provides executive summary, and invites them to the next edition.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUTOMATIONS */}
      {activeTab === 'automations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-serif">Configured Lifecycle Automations</h3>
              <p className="text-xs text-stone-400">
                Triggered automatically by database events (registration creation, check-in reconciliation, directory approvals).
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {automations.map((auto) => (
              <div
                key={auto.id}
                className="p-5 bg-[#141414] border border-[#262626] rounded-xl space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222222] pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                        auto.status === 'active'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{auto.name}</h4>
                        <span
                          className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider ${
                            auto.status === 'active'
                              ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                              : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {auto.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">{auto.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleToggleAutomation(auto.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                        auto.status === 'active'
                          ? 'bg-amber-950/50 text-amber-300 border border-amber-800/40 hover:bg-amber-900/50'
                          : 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/50'
                      }`}
                    >
                      {auto.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{auto.status === 'active' ? 'Pause Automation' : 'Activate Automation'}</span>
                    </button>
                  </div>
                </div>

                {/* Workflow Visual Steps */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">
                    Execution Flow & Action Nodes
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                    {auto.steps?.map((step, idx) => (
                      <div
                        key={step.id || idx}
                        className="p-3 bg-[#181818] border border-[#2a2a2a] rounded-lg space-y-1 text-stone-300 relative"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#D8C39A]">
                          <span>Step {idx + 1}</span>
                          <span className="uppercase">{step.delay || 'Instant'}</span>
                        </div>
                        <span className="font-semibold text-white block text-xs">{step.title}</span>
                        <span className="text-[10px] text-stone-500 block">Template: {step.templateId || 'Dynamic'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Statistics Bar */}
                {auto.stats && (
                  <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[#222222] text-[11px] text-stone-400">
                    <span>
                      Triggered: <strong className="text-white">{auto.stats.triggered}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Delivered: <strong className="text-emerald-400">{auto.stats.delivered}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Opened: <strong className="text-white">{auto.stats.opened}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Clicked: <strong className="text-white">{auto.stats.clicked}</strong>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EMAIL TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-serif">Executive Email Templates ({templates.length})</h3>
              <p className="text-xs text-stone-400">
                Responsive branded templates with dynamic variable tags for personalized delegate communications.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="p-5 bg-[#141414] border border-[#262626] rounded-xl flex flex-col justify-between space-y-3.5 hover:border-[#383838] transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#222222] text-[#C5A46D] border border-[#333333]">
                      {tpl.category || 'General'}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">ID: {tpl.id}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{tpl.name}</h4>
                  <div className="p-2.5 bg-[#181818] border border-[#282828] rounded-lg text-xs text-stone-300 space-y-0.5">
                    <span className="text-[10px] text-stone-500 font-mono block">SUBJECT</span>
                    <span className="font-medium text-white truncate block">{tpl.subject}</span>
                  </div>

                  {/* Variables badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {tpl.variables?.map((v) => (
                      <span key={v} className="px-1.5 py-0.5 rounded bg-[#1e1e1e] text-[10px] font-mono text-stone-400">
                        {`{{${v}}}`}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#222222] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewTemplate(tpl);
                        setPreviewMode('desktop');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#1e1e1e] hover:bg-[#282828] text-stone-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTestingTemplateId(tpl.id);
                        setIsTestEmailModalOpen(true);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#1e1e1e] hover:bg-[#282828] text-[#D8C39A] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Test Send</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setTemplateForm({
                        id: tpl.id,
                        name: tpl.name,
                        category: tpl.category || 'Event Booking',
                        subject: tpl.subject,
                        body: tpl.body,
                        variables: tpl.variables || []
                      });
                      setIsTemplateModalOpen(true);
                    }}
                    className="p-1.5 rounded hover:bg-[#242424] text-stone-400 hover:text-white cursor-pointer"
                    title="Edit Template"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIENCE SEGMENTS */}
      {activeTab === 'segments' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white font-serif">Dynamic Database Audience Segments ({segments.length})</h3>
            <p className="text-xs text-stone-400">
              Real-time contact clusters queried from actual database collections (registrations, founders, academy, partnerships).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {segments.map((seg) => (
              <div
                key={seg.id}
                className="p-4 bg-[#141414] border border-[#262626] rounded-xl flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#222222] text-[#C5A46D] border border-[#333333]">
                      {seg.category}
                    </span>
                    <h4 className="text-xs font-bold text-white">{seg.name}</h4>
                  </div>
                  <p className="text-[11px] text-stone-400">{seg.description}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-lg font-bold font-mono text-white block">{seg.count}</span>
                  <span className="text-[10px] text-stone-500 uppercase font-mono">Members</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: DELIVERY HISTORY & LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-serif">Transmission Delivery Logs ({deliveryLogs.length})</h3>
              <p className="text-xs text-stone-400">
                Audit log of all outbound emails, delivery statuses, TLS handshake logs, and bounce reports.
              </p>
            </div>
          </div>

          <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-[#181818] border-b border-[#282828] text-stone-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Recipient</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Workflow / Reason</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222222]">
                  {deliveryLogs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-stone-500">
                        No delivery logs recorded yet.
                      </td>
                    </tr>
                  ) : (
                    deliveryLogs.slice(0, 50).map((log) => (
                      <tr key={log.id} className="hover:bg-[#1a1a1a]/80">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{log.recipientName || 'Delegate'}</div>
                          <div className="text-[11px] text-stone-400">{log.recipientEmail}</div>
                        </td>
                        <td className="py-3 px-4 text-stone-300 max-w-xs truncate">{log.subject}</td>
                        <td className="py-3 px-4 text-stone-400 font-mono text-[11px]">{log.workflowId || 'Manual Campaign'}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              log.status === 'DELIVERED'
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                                : 'bg-red-950/60 text-red-400 border border-red-800/40'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-stone-500 font-mono text-[11px]">
                          {log.sentAt ? new Date(log.sentAt).toLocaleString() : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DISPATCH NEW CAMPAIGN */}
      {isNewCampaignModalOpen && (
        <AdminModal
          isOpen={isNewCampaignModalOpen}
          onClose={() => setIsNewCampaignModalOpen(false)}
          title="Dispatch Campaign Broadcast"
          subtitle="Select audience segment and branded template to execute email blast."
          maxWidth="max-w-xl"
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsNewCampaignModalOpen(false)}
                className="px-4 py-2 border border-[#333333] hover:bg-[#222222] text-stone-300 rounded-lg text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendCampaign}
                className="px-5 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Campaign Now</span>
              </button>
            </>
          }
        >
          <form className="space-y-4">
            <div>
              <label className="text-stone-300 font-semibold block mb-1">Campaign Internal Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Q2 Founder Connect Announcement"
                value={campaignForm.title}
                onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-xs text-white focus:border-[#C5A46D] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-stone-300 font-semibold block mb-1">Audience Segment *</label>
                <select
                  value={campaignForm.segmentId}
                  onChange={(e) => setCampaignForm({ ...campaignForm, segmentId: e.target.value })}
                  className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-xs text-white focus:border-[#C5A46D] outline-none"
                >
                  {segments.map((seg) => (
                    <option key={seg.id} value={seg.id}>
                      {seg.name} ({seg.count})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-stone-300 font-semibold block mb-1">Email Template *</label>
                <select
                  value={campaignForm.templateId}
                  onChange={(e) => setCampaignForm({ ...campaignForm, templateId: e.target.value })}
                  className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-xs text-white focus:border-[#C5A46D] outline-none"
                >
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-stone-300 font-semibold block mb-1">Custom Subject (Optional)</label>
              <input
                type="text"
                placeholder="Leave blank to use default template subject"
                value={campaignForm.subject}
                onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })}
                className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-xs text-white focus:border-[#C5A46D] outline-none"
              />
            </div>
          </form>
        </AdminModal>
      )}

      {/* MODAL: EDIT / CREATE TEMPLATE */}
      {isTemplateModalOpen && (
        <AdminModal
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          title={templateForm.id ? `Edit Template: ${templateForm.name}` : 'Create Branded Email Template'}
          maxWidth="max-w-2xl"
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="px-4 py-2 border border-[#333333] hover:bg-[#222222] text-stone-300 rounded-lg text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveTemplate}
                className="px-5 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] font-bold rounded-lg text-xs cursor-pointer"
              >
                Save Template
              </button>
            </>
          }
        >
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-stone-300 font-semibold block mb-1">Template Name *</label>
                <input
                  type="text"
                  required
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  placeholder="e.g. VIP Founder Dinner Invitation"
                  className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-xs text-white focus:border-[#C5A46D] outline-none"
                />
              </div>

              <div>
                <label className="text-stone-300 font-semibold block mb-1">Category</label>
                <select
                  value={templateForm.category}
                  onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                  className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-xs text-white focus:border-[#C5A46D] outline-none"
                >
                  <option value="Event Booking">Event Booking</option>
                  <option value="Event Reminders">Event Reminders</option>
                  <option value="Post-Event">Post-Event</option>
                  <option value="Academy">Academy</option>
                  <option value="Newsletter">Newsletter</option>
                  <option value="Community">Community</option>
                  <option value="Partnerships">Partnerships</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-stone-300 font-semibold block mb-1">Subject Line *</label>
              <input
                type="text"
                required
                value={templateForm.subject}
                onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                placeholder="e.g. Confirmed: Your Delegate Pass for {{event_name}}"
                className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-xs text-white focus:border-[#C5A46D] outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-stone-300 font-semibold text-xs">HTML / Rich Body *</label>
                <span className="text-[10px] text-stone-500">
                  Dynamic variables: {'{{first_name}}, {{event_name}}, {{ticket_reference}}, {{event_date}}'}
                </span>
              </div>
              <textarea
                rows={9}
                required
                value={templateForm.body}
                onChange={(e) => setTemplateForm({ ...templateForm, body: e.target.value })}
                placeholder="<h2>7 HORSE VENTURES</h2><p>Dear {{first_name}},</p>..."
                className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-xs text-white font-mono focus:border-[#C5A46D] outline-none"
              />
            </div>
          </form>
        </AdminModal>
      )}

      {/* MODAL: PREVIEW TEMPLATE (DESKTOP & MOBILE) */}
      {previewTemplate && (
        <AdminModal
          isOpen={Boolean(previewTemplate)}
          onClose={() => setPreviewTemplate(null)}
          title={`Preview: ${previewTemplate.name}`}
          subtitle={`Subject: "${previewTemplate.subject}"`}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5 p-1 bg-[#181818] rounded-lg border border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-1.5 rounded flex items-center gap-1 text-xs cursor-pointer ${
                    previewMode === 'desktop' ? 'bg-[#C5A46D] text-[#101010] font-bold' : 'text-stone-400'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-1.5 rounded flex items-center gap-1 text-xs cursor-pointer ${
                    previewMode === 'mobile' ? 'bg-[#C5A46D] text-[#101010] font-bold' : 'text-stone-400'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 border border-[#333333] hover:bg-[#222222] text-stone-300 rounded-lg text-xs font-medium cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          }
        >
          <div className="flex justify-center py-2">
            <div
              className={`bg-white text-[#101010] rounded-xl p-6 shadow-xl border border-stone-300 transition-all ${
                previewMode === 'mobile' ? 'max-w-xs' : 'w-full'
              }`}
            >
              <div
                className="prose prose-sm max-w-none text-xs"
                dangerouslySetInnerHTML={{
                  __html: previewTemplate.body
                    .replace(/\{\{\s*first_name\s*\}\}/g, 'Priya')
                    .replace(/\{\{\s*full_name\s*\}\}/g, 'Priya Sharma')
                    .replace(/\{\{\s*event_name\s*\}\}/g, '7H Founder Connect — Founders & Builders Roundtable')
                    .replace(/\{\{\s*event_date\s*\}\}/g, 'Saturday, August 15, 2026')
                    .replace(/\{\{\s*event_time\s*\}\}/g, '4:00 PM – 7:30 PM IST')
                    .replace(/\{\{\s*event_location\s*\}\}/g, 'Cyber City, DLF Phase 2, Gurugram')
                    .replace(/\{\{\s*ticket_reference\s*\}\}/g, '7H-PASS-491023')
                    .replace(/\{\{\s*registration_link\s*\}\}/g, '#')
                }}
              />
            </div>
          </div>
        </AdminModal>
      )}

      {/* MODAL: TEST EMAIL */}
      {isTestEmailModalOpen && (
        <AdminModal
          isOpen={isTestEmailModalOpen}
          onClose={() => setIsTestEmailModalOpen(false)}
          title="Send Real Test Email"
          subtitle="Verifies live SMTP handshake and renders variable tags with sample delegate data."
          maxWidth="max-w-md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsTestEmailModalOpen(false)}
                className="px-4 py-2 border border-[#333333] hover:bg-[#222222] text-stone-300 rounded-lg text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendTestEmail}
                className="px-5 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Test</span>
              </button>
            </>
          }
        >
          <div className="space-y-3">
            <label className="text-stone-300 font-semibold block text-xs">Destination Email Address *</label>
            <input
              type="email"
              required
              value={testEmailAddress}
              onChange={(e) => setTestEmailAddress(e.target.value)}
              placeholder="e.g. founder@7horseventures.com"
              className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-xs text-white focus:border-[#C5A46D] outline-none"
            />
            <p className="text-[11px] text-stone-500">
              Dispatches a test rendering with active variables substituted with real sample attendee credentials.
            </p>
          </div>
        </AdminModal>
      )}

      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        onClose={() => setConfirmModalState({ ...confirmModalState, isOpen: false })}
        onConfirm={confirmModalState.onConfirm}
        title={confirmModalState.title}
        description={confirmModalState.description}
      />
    </div>
  );
}
