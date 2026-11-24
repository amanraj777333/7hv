import React, { useState, useEffect } from 'react';
import { Save, Edit2, Eye, Trash2, ArrowUpRight } from 'lucide-react';
import AdminModal from './AdminModal';

export default function RecordDetailModal({
  isOpen,
  onClose,
  record,
  onSave,
  onDelete,
  title = 'Record Details',
  editableFields = [],
  readOnlyFields = []
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (record) {
      setFormData({ ...record });
      setIsEditing(false);
    }
  }, [record]);

  if (!record) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(formData);
      }
      setIsEditing(false);
    } catch (err) {
      alert('Failed to save record: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit: ${record.name || record.title || 'Record'}` : (record.name || record.title || title)}
      subtitle={`ID: ${record.id} • Last Updated: ${record.updatedAt || record.createdAt || 'N/A'}`}
      maxWidth="max-w-2xl"
      footer={
        isEditing ? (
          <>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-[#333333] hover:bg-[#222222] text-stone-300 rounded-lg text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="px-5 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(record)}
                  className="px-3.5 py-1.5 rounded-lg border border-red-900/40 text-red-400 hover:bg-red-950/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#333333] hover:bg-[#222222] text-stone-300 rounded-lg text-xs font-medium cursor-pointer"
              >
                Close
              </button>
              {editableFields.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Record</span>
                </button>
              )}
            </div>
          </div>
        )
      }
    >
      <div className="space-y-4">
        {/* Main Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {editableFields.map((field) => (
            <div key={field.key} className={field.fullWidth ? 'sm:col-span-2' : ''}>
              <label className="text-stone-400 font-semibold text-[11px] block mb-1">
                {field.label} {field.required && <span className="text-red-400">*</span>}
              </label>
              {isEditing ? (
                field.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData({ ...formData, field: field.key, [field.key]: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] focus:border-[#C5A46D] rounded-lg p-2.5 text-xs text-white outline-none"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] focus:border-[#C5A46D] rounded-lg p-2.5 text-xs text-white outline-none"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || 'text'}
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] focus:border-[#C5A46D] rounded-lg p-2.5 text-xs text-white outline-none"
                  />
                )
              ) : (
                <div className="p-2.5 bg-[#181818] border border-[#242424] rounded-lg text-white font-medium text-xs break-words">
                  {record[field.key] !== undefined && record[field.key] !== '' ? (
                    String(record[field.key])
                  ) : (
                    <span className="text-stone-500 italic">Not specified</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Read-Only System Metadata */}
        {readOnlyFields.length > 0 && (
          <div className="pt-3 border-t border-[#222222] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
              System Metadata & Audit
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
              {readOnlyFields.map((meta) => (
                <div key={meta.key} className="p-2 bg-[#121212] rounded-lg border border-[#202020]">
                  <span className="text-stone-500 block text-[10px]">{meta.label}</span>
                  <span className="text-stone-300 font-mono truncate block">{record[meta.key] || '-'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminModal>
  );
}
