import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function AdminModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
  footer = null
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-[#141414] border border-[#2e2e2e] text-[#E8E5DF] rounded-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Accent Line */}
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#C5A46D] to-transparent" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#242424] flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-bold text-white font-serif">{title}</h3>
            {subtitle && <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#222222] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-xs space-y-4">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="p-4 border-t border-[#242424] bg-[#111111] flex items-center justify-end gap-2.5 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
