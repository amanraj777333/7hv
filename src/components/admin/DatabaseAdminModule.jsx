import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Database, Download, RefreshCw, CheckCircle2, ShieldCheck, HardDrive, FileText } from 'lucide-react';

export default function DatabaseAdminModule() {
  const { authToken, showToast } = useApp();
  const [dbInfo, setDbInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackup, setLastBackup] = useState(null);

  const fetchDbInfo = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/database/info');
      if (res.ok) {
        const data = await res.json();
        setDbInfo(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDbInfo();
  }, []);

  const handleTriggerBackup = async () => {
    setIsBackingUp(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

      const res = await fetch('/api/database/backup', {
        method: 'POST',
        headers
      });
      if (res.ok) {
        const data = await res.json();
        setLastBackup(data);
        showToast(`Database backup created: ${data.backupFile}`, 'success');
        fetchDbInfo();
      } else {
        showToast('Backup failed. Check permissions.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error triggering backup.', 'error');
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#242424]">
        <div>
          <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-[#C5A46D]" />
            <span>Database Audit & Production Backups</span>
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Real-time audit of storage configuration, active tables, record counts, and automated backup snapshots.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDbInfo}
            disabled={isLoading}
            className="p-2 bg-[#1C1C1C] hover:bg-[#252525] border border-stone-700 text-stone-300 rounded cursor-pointer"
            title="Refresh database status"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleTriggerBackup}
            disabled={isBackingUp}
            className="px-4 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-black text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isBackingUp ? 'Creating Snapshot...' : 'Create Instant Backup'}</span>
          </button>
        </div>
      </div>

      {dbInfo && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-[#141414] border border-[#242424] rounded-xl space-y-1">
              <span className="text-[11px] font-mono text-[#C5A46D] block">Engine Architecture</span>
              <h3 className="text-sm font-semibold text-white">{dbInfo.databaseType}</h3>
              <p className="text-[11px] text-stone-400 truncate" title={dbInfo.location}>
                Path: {dbInfo.location}
              </p>
            </div>

            <div className="p-5 bg-[#141414] border border-[#242424] rounded-xl space-y-1">
              <span className="text-[11px] font-mono text-[#C5A46D] block">Active Tables / Collections</span>
              <h3 className="text-2xl font-bold font-mono text-white">{dbInfo.tables?.length || 0}</h3>
              <p className="text-[11px] text-stone-400">Total Records: {dbInfo.totalRecords}</p>
            </div>

            <div className="p-5 bg-[#141414] border border-[#242424] rounded-xl space-y-1">
              <span className="text-[11px] font-mono text-[#C5A46D] block">Backup Policy</span>
              <h3 className="text-sm font-semibold text-white">Automated Snapshot on Boot & Sync</h3>
              <p className="text-[11px] text-stone-400">10-version rolling retention</p>
            </div>
          </div>

          {lastBackup && (
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl flex items-center gap-3 text-emerald-300 text-xs">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <strong>Backup created successfully:</strong> {lastBackup.backupFile} at {new Date(lastBackup.timestamp).toLocaleTimeString()}
              </div>
            </div>
          )}

          {/* Table Breakdown Grid */}
          <div className="bg-[#141414] border border-[#242424] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#242424]">
              <h3 className="text-sm font-semibold text-white">Collection / Table Inventory</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4">
              {dbInfo.tables?.map((table) => (
                <div key={table.name} className="p-3 bg-[#1A1A1A] border border-[#282828] rounded-lg">
                  <span className="text-xs font-semibold text-white block capitalize">
                    {table.name.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm font-bold font-mono text-[#C5A46D]">
                    {table.count} <span className="text-[10px] font-normal text-stone-400">records</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
