import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, X, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SignInModal() {
  const { signInModalOpen, setSignInModalOpen, login, currentUser, logout, navigate, theme } = useApp();
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!signInModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!passcode.trim()) {
      setErrorMsg('Please enter your access passcode.');
      return;
    }

    setIsLoading(true);
    const success = await login(passcode, email);
    setIsLoading(false);

    if (success) {
      setSignInModalOpen(false);
      navigate('/admin');
    } else {
      setErrorMsg('Invalid passcode or unauthorized credentials.');
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn"
      onClick={() => setSignInModalOpen(false)}
    >
      <div
        className={`w-full max-w-md rounded-2xl border p-6 sm:p-8 shadow-2xl relative transition-all duration-200 ${
          isDark
            ? 'bg-[#141414] text-[#F7F5F0] border-[#2A2A2A]'
            : 'bg-white text-[#101010] border-[#E8E5DF]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSignInModalOpen(false)}
          className={`absolute top-4 right-4 p-2 rounded-full cursor-pointer transition-colors ${
            isDark ? 'text-stone-400 hover:text-white hover:bg-white/10' : 'text-stone-500 hover:text-black hover:bg-stone-100'
          }`}
          aria-label="Close sign in dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {currentUser ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-full bg-[#C5A46D]/15 text-[#C5A46D] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading">Already Signed In</h3>
              <p className="text-xs text-stone-400 mt-1">
                You are currently authenticated as <strong>{currentUser.name}</strong> ({currentUser.role}).
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  setSignInModalOpen(false);
                  navigate('/admin');
                }}
                className="w-full py-2.5 bg-[#C5A46D] hover:bg-[#D8C39A] text-black text-xs font-semibold rounded cursor-pointer transition-colors btn-press"
              >
                Go to Admin Operations Console
              </button>
              <button
                onClick={() => {
                  logout();
                  setSignInModalOpen(false);
                }}
                className={`w-full py-2.5 text-xs font-medium rounded border cursor-pointer transition-colors ${
                  isDark ? 'border-stone-700 text-stone-300 hover:bg-stone-800' : 'border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-2 text-left">
              <div className="w-10 h-10 rounded-lg bg-[#C5A46D]/15 text-[#C5A46D] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading">
                Sign In to 7 Horse
              </h2>
              <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'} leading-relaxed`}>
                Access the private Operations Console, event manage desks, and curated member directories.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Email Address <span className="text-stone-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="admin@7horseventures.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded border transition-colors focus:border-[#C5A46D] focus:outline-none ${
                    isDark ? 'bg-[#1C1C1C] border-[#333333] text-white' : 'bg-[#FAF7F2] border-[#D5D1C8] text-[#101010]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Access Passcode *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded border transition-colors focus:border-[#C5A46D] focus:outline-none ${
                    isDark ? 'bg-[#1C1C1C] border-[#333333] text-white' : 'bg-[#FAF7F2] border-[#D5D1C8] text-[#101010]'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-semibold rounded flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50 btn-press"
              >
                <span>{isLoading ? 'Verifying Credentials...' : 'Sign In'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className={`pt-2 border-t text-center text-[11px] ${isDark ? 'border-[#262626] text-stone-500' : 'border-[#E8E5DF] text-stone-500'}`}>
              Restricted to verified administrators, ecosystem fellows and partners.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
