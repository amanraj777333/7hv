import React from 'react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import { Home, Calendar } from 'lucide-react';

export default function NotFoundPage() {
  const { navigate } = useApp();

  return (
    <div className="bg-[#F7F5F0] text-[#101010] min-h-[80vh] flex items-center justify-center py-20 px-4">
      <SEO
        title="Page Not Found (404) — 7 Horse Ventures"
        description="The requested page could not be located. Explore the 7 Horse Ventures ecosystem, events, or contact our team."
      />

      <div className="max-w-xl w-full text-center space-y-6 bg-white p-10 sm:p-14 rounded-2xl border border-[#E8E5DF]">
        <div className="space-y-2">
          <span className="text-xs font-mono text-[#A9874D]">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#101010] font-heading">
            Page Not Located
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm mx-auto">
            The destination you requested may have moved or is being prepared for upcoming ecosystem releases.
          </p>
        </div>

        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <button
            onClick={() => navigate('/')}
            className="p-3 rounded-lg bg-[#101010] text-white hover:bg-[#252525] font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Home className="w-4 h-4 text-[#C5A46D]" />
            <span>Return to homepage</span>
          </button>

          <button
            onClick={() => navigate('/events')}
            className="p-3 rounded-lg border border-[#E8E5DF] text-stone-800 hover:border-stone-400 font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors bg-[#FAF7F2]"
          >
            <Calendar className="w-4 h-4 text-[#A9874D]" />
            <span>View events</span>
          </button>
        </div>

        <div className="pt-4 border-t border-[#F2EFE9] text-xs text-stone-500">
          Need assistance? Reach our coordinator at{' '}
          <button
            onClick={() => navigate('/contact')}
            className="text-[#A9874D] font-bold hover:underline cursor-pointer"
          >
            Contact Desk
          </button>
        </div>
      </div>
    </div>
  );
}
