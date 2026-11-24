import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import AdminModal from './AdminModal';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  isLoading = false,
  count = 1
}) {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#333333] hover:bg-[#222222] text-stone-300 text-xs font-medium cursor-pointer transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010]'
            } disabled:opacity-50`}
          >
            {isDestructive && <Trash2 className="w-3.5 h-3.5" />}
            <span>{isLoading ? 'Processing...' : confirmText}</span>
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3.5 py-1">
        <div
          className={`p-2.5 rounded-xl shrink-0 ${
            isDestructive ? 'bg-red-950/60 border border-red-800/50 text-red-400' : 'bg-amber-950/60 border border-amber-800/50 text-amber-400'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs text-stone-300 leading-relaxed">{description}</p>
          {count > 1 && (
            <p className="text-[11px] font-semibold text-amber-400">
              Affects {count} selected records.
            </p>
          )}
          <p className="text-[11px] text-stone-500">
            This action will update the database immediately. Records can be reviewed or restored by authorized administrators from the audit archive.
          </p>
        </div>
      </div>
    </AdminModal>
  );
}
