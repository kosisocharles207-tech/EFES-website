import React, { useState } from 'react';
import { useEFES } from '../context/EFESContext';
import {
  Shield,
  Lock,
  CheckCircle2,
  X,
  Trophy,
  KeyRound,
  Sparkles,
  Eye,
  EyeOff,
  Mail,
  ShieldAlert,
  LockKeyhole,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginOpen,
    setIsAdminLoginOpen,
    loginAdmin,
    setCurrentPage,
  } = useEFES();

  const [identifierInput, setIdentifierInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isAdminLoginOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const targetUser = identifierInput.trim();
    const targetPass = passwordInput.trim();

    if (!targetUser) {
      setErrorMsg('Please enter your approved Admin Username or Email address.');
      sounds.playClick();
      return;
    }

    if (!targetPass) {
      setErrorMsg('Please enter your confidential Admin Password.');
      sounds.playClick();
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = loginAdmin(targetUser, targetPass);
      setIsSubmitting(false);

      if (result.success) {
        setSuccessMsg(result.message || `Access Granted: Welcome back, ${targetUser}!`);
        setTimeout(() => {
          setIsAdminLoginOpen(false);
          setSuccessMsg(null);
          setCurrentPage('admin');
        }, 400);
      } else {
        setErrorMsg(
          result.error ||
            '🚫 ACCESS DENIED: You do not have permission to access the EFES Admin Dashboard.'
        );
        sounds.playWhistle();
      }
    }, 200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200"
      onClick={() => setIsAdminLoginOpen(false)}
    >
      {/* Stadium Ambient Floodlights */}
      <div className="fixed top-0 left-1/4 h-80 w-80 rounded-full bg-amber-500/15 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 h-80 w-80 rounded-full bg-yellow-500/10 blur-[130px] pointer-events-none" />

      {/* eFootball 2027 Gold Glowing Confidential Login Card */}
      <div
        className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl border-2 border-amber-500/60 bg-gradient-to-b from-[#0e1738] via-[#080e24] to-[#030612] shadow-[0_0_80px_rgba(245,158,11,0.4)] efootball-card-foil text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative corner flares */}
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-yellow-600/15 blur-3xl pointer-events-none" />

        {/* Header with EFES Crest */}
        <div className="relative bg-gradient-to-r from-amber-950/90 via-[#0a1432] to-amber-950/90 p-6 sm:p-7 text-center border-b border-amber-500/40">
          <button
            onClick={() => setIsAdminLoginOpen(false)}
            className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center rounded-full bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-700 transition-all shadow-md"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          {/* EFES Crest Emblem */}
          <div className="mx-auto mb-3.5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 p-1 shadow-[0_0_35px_rgba(245,158,11,0.6)] animate-gold-pulse">
            <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-[#050814]">
              <Trophy className="h-10 w-10 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-amber-300 mb-2 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
            <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-pulse" />
            <span>EFES Executive Console</span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wider text-white drop-shadow-md">
            ADMIN AUTHENTICATION
          </h3>
          <p className="text-xs text-amber-300/90 mt-1 font-medium tracking-wide">
            Strict Council Security &amp; Credential Verification
          </p>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-start gap-3 rounded-2xl bg-red-950/90 border-2 border-red-500/80 p-4 text-xs text-red-100 shadow-[0_0_25px_rgba(239,68,68,0.4)] animate-in shake duration-200">
              <ShieldAlert className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
              <div className="space-y-1">
                <span className="font-black text-sm block tracking-wide text-red-300">
                  {errorMsg.includes('ACCESS DENIED') ? '🚫 ACCESS DENIED' : 'AUTHENTICATION FAILED'}
                </span>
                <span className="leading-relaxed block font-medium">{errorMsg}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-950/90 border-2 border-emerald-500/80 p-4 text-xs text-emerald-100 shadow-[0_0_25px_rgba(16,185,129,0.4)] animate-in zoom-in-95">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              <div>
                <span className="font-black text-sm block text-emerald-300">ACCESS GRANTED</span>
                <span className="font-medium">{successMsg}</span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email field */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Admin Username or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter admin username (e.g. Kosikosi)"
                  value={identifierInput}
                  onChange={(e) => setIdentifierInput(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-700 bg-black/70 px-4 py-3 pl-11 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 shadow-inner"
                  required
                  autoFocus
                />
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-amber-400/90" />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-700 bg-black/70 px-4 py-3 pl-11 pr-11 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 shadow-inner font-mono"
                  required
                />
                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-amber-400/90" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-zinc-400 hover:text-amber-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="gold-button w-full rounded-2xl py-3.5 font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.5)] cursor-pointer disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  <span>Authorize &amp; Enter Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="rounded-2xl bg-black/75 border border-zinc-800 p-4 text-[11px] text-zinc-400 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <LockKeyhole className="h-4 w-4 text-amber-400" />
              <span>CONFIDENTIAL COUNCIL ACCESS ONLY</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              This console is strictly restricted to authorized EFES Council Administrators.
              All authentication attempts are audited and logged with IP and device signatures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
