import React from 'react';
import { CheckSquare, Trash2, Download, Check, X, RotateCcw } from 'lucide-react';

export default function BulkActionBar({
  selectedCount = 0,
  totalCount = 0,
  onSelectAll,
  onClearSelection,
  onBulkDelete,
  onBulkExport,
  onBulkApprove,
  onBulkReject,
  onBulkRestore,
  isAllSelected = false,
  showStatusActions = false,
  showRestoreAction = false
}) {
  if (selectedCount === 0) return null;

  return (
    <aside
      aria-label="Bulk selection toolbar"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#141414] border-2 border-[#C5A46D] text-white px-5 py-3 rounded-2xl shadow-2xl flex flex-wrap items-center gap-3 sm:gap-4 animate-slideUp text-xs backdrop-blur-md max-w-2xl w-[92%]"
    >
      {/* Selected Counter & Toggle */}
      <div className="flex items-center gap-2 pr-3 border-r border-[#2e2e2e]">
        <CheckSquare className="w-4 h-4 text-[#C5A46D]" />
        <span className="font-bold text-white whitespace-nowrap">
          {selectedCount} <span className="font-normal text-stone-400">selected</span>
        </span>
      </div>

      {/* Select All / Clear */}
      <div className="flex items-center gap-2">
        {!isAllSelected && onSelectAll && (
          <button
            type="button"
            onClick={onSelectAll}
            className="text-[11px] text-[#D8C39A] hover:underline cursor-pointer"
          >
            Select All ({totalCount})
          </button>
        )}
        <button
          type="button"
          onClick={onClearSelection}
          className="text-[11px] text-stone-400 hover:text-white cursor-pointer"
        >
          Clear
        </button>
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {showStatusActions && onBulkApprove && (
          <button
            type="button"
            onClick={onBulkApprove}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-800/60 hover:bg-emerald-900/80 text-emerald-300 font-semibold text-xs flex items-center gap-1 cursor-pointer"
            title="Approve Selected"
          >
            <Check className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Approve</span>
          </button>
        )}

        {showStatusActions && onBulkReject && (
          <button
            type="button"
            onClick={onBulkReject}
            className="px-2.5 py-1.5 rounded-lg bg-amber-950/70 border border-amber-800/60 hover:bg-amber-900/80 text-amber-300 font-semibold text-xs flex items-center gap-1 cursor-pointer"
            title="Reject Selected"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reject</span>
          </button>
        )}

        {showRestoreAction && onBulkRestore && (
          <button
            type="button"
            onClick={onBulkRestore}
            className="px-2.5 py-1.5 rounded-lg bg-blue-950/70 border border-blue-800/60 hover:bg-blue-900/80 text-blue-300 font-semibold text-xs flex items-center gap-1 cursor-pointer"
            title="Restore Selected"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore</span>
          </button>
        )}

        {onBulkExport && (
          <button
            type="button"
            onClick={onBulkExport}
            className="px-3 py-1.5 rounded-lg bg-[#222222] hover:bg-[#2c2c2c] text-stone-200 border border-[#3a3a3a] font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span>Export</span>
          </button>
        )}

        {onBulkDelete && (
          <button
            type="button"
            onClick={onBulkDelete}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        )}
      </div>
    </aside>
  );
}
