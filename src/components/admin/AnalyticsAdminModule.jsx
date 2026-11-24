import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Users,
  Eye,
  Globe,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Activity
} from 'lucide-react';

export default function AnalyticsAdminModule() {
  const { analytics } = useApp();
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    fetch('/api/audit-logs')
      .then((r) => r.json())
      .then((logs) => {
        if (Array.isArray(logs)) setAuditLogs(logs.reverse());
      })
      .catch((err) => console.error('Failed to load audit logs:', err));
  }, []);

  const sources = [
    { label: 'Direct Traffic & Referral', percentage: 42, count: '4,820' },
    { label: 'LinkedIn Founder Community', percentage: 28, count: '3,210' },
    { label: 'Curated WhatsApp Cohort Groups', percentage: 18, count: '2,060' },
    { label: 'Google Search & SEO', percentage: 12, count: '1,380' }
  ];

  const topPages = [
    { path: '/', title: 'Homepage — Ecosystem Portal', views: '6,420' },
    { path: '/events', title: 'Events & Cohort Gatherings', views: '3,890' },
    { path: '/pitch-capital-connect', title: 'Pitch & Capital Showcase', views: '2,430' },
    { path: '/insights', title: 'Venture Insights & Playbooks', views: '1,720' },
    { path: '/founders', title: 'Delhi NCR Founder Directory', views: '1,310' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Ecosystem Analytics & Audit Stream</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Real-time traffic channels, engagement velocity, and tamper-evident administrative audit logs.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-800/40">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Real-time Telemetry Live</span>
        </div>
      </div>

      {/* Traffic Sources & Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sources */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>Visitor Acquisition Channels</span>
            <Globe className="w-4 h-4 text-[#C5A46D]" />
          </h3>
          <div className="space-y-3.5 text-xs">
            {sources.map((src) => (
              <div key={src.label} className="space-y-1.5">
                <div className="flex justify-between text-stone-300">
                  <span className="font-medium">{src.label}</span>
                  <span className="text-stone-400">{src.count} ({src.percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-[#222222] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C5A46D] rounded-full"
                    style={{ width: `${src.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>High Engagement Pages</span>
            <Eye className="w-4 h-4 text-[#C5A46D]" />
          </h3>
          <div className="space-y-2.5 text-xs">
            {topPages.map((pg) => (
              <div
                key={pg.path}
                className="p-2.5 bg-[#1a1a1a] border border-[#282828] rounded-lg flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-white">{pg.title}</div>
                  <div className="text-[11px] text-stone-500 font-mono mt-0.5">{pg.path}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">{pg.views}</div>
                  <div className="text-[10px] text-stone-500">views</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#C5A46D]" />
          <span>Operations Audit Log Stream</span>
        </h3>
        <p className="text-xs text-stone-400 mb-4">
          All administrative operations, image replacements, article publishing, and status changes are recorded.
        </p>

        <div className="space-y-2 max-h-72 overflow-y-auto">
          {auditLogs.length === 0 ? (
            <div className="text-center py-6 text-xs text-stone-500">No audit activity logged yet.</div>
          ) : (
            auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-[#181818] border border-[#282828] rounded-lg flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span>{log.action}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-[#252525] text-stone-300 rounded font-normal">
                      by {log.user}
                    </span>
                  </div>
                  <div className="text-stone-400 text-[11px] mt-0.5">{log.details}</div>
                </div>
                <div className="text-[10px] text-stone-500 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
