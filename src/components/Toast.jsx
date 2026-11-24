import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast() {
  const { toasts } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-xl border backdrop-blur-md transition-all duration-300 animate-slideIn ${
              isSuccess
                ? 'bg-[#101010]/95 border-[#C5A46D]/60 text-white'
                : isError
                ? 'bg-rose-950/95 border-rose-500/50 text-rose-100'
                : 'bg-[#181818]/95 border-stone-700 text-stone-200'
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-5 h-5 text-[#C5A46D] shrink-0 mt-0.5" />
            ) : isError ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 text-xs sm:text-sm leading-snug">
              {toast.message}
            </div>
          </div>
        );
      })}
    </div>
  );
}
