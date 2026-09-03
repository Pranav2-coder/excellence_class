import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap, Mail, Lock, Eye, EyeOff,
  ArrowLeft, ShieldCheck, Smartphone,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAdminSetup } from '../hooks/useAdminSetup';
import { supabase } from '../lib/supabase';
import SetupAdminForm from '../components/SetupAdminForm';
import DemoBadge from '../components/DemoBadge';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin } = useApp();

  // ── Admin-existence check ─────────────────────────────────
  const { adminExists, loading: setupLoading, error: setupError, refetch } = useAdminSetup();

  // ── Login form state ──────────────────────────────────────
  const [email,    setEmail]    = useState(localStorage.getItem('admin_email_cache') || '');
  const [password, setPassword] = useState('');  // never pre-fill password from cache
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  // ── Forgot-password state ─────────────────────────────────
  const [forgotMode,    setForgotMode]    = useState(false);
  const [forgotEmail,   setForgotEmail]   = useState('');
  const [forgotMsg,     setForgotMsg]     = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // ── PWA install ───────────────────────────────────────────
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') console.log('PWA install accepted');
    setInstallPrompt(null);
  };

  // ── Login ─────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }

    setLoading(true);
    try {
      // 1. Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        // Give a friendly message — never expose internal Supabase errors
        if (authError.message?.toLowerCase().includes('invalid login credentials')) {
          throw new Error('Invalid email or password. Please try again.');
        }
        throw authError;
      }

      const userId = authData?.user?.id;
      if (!userId) throw new Error('Login failed. Please try again.');

      // 2. Verify this is the registered admin (not any random Supabase user)
      const { data: profile, error: profileError } = await supabase
        .from('admin_profiles')
        .select('id, role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile) {
        // Signed into Supabase but NOT the admin — reject immediately
        await supabase.auth.signOut();
        throw new Error('Access denied. This account is not an admin.');
      }

      // 3. Persist email (never password) for convenience
      localStorage.setItem('admin_email_cache', email.trim().toLowerCase());

      // 4. Update app state and redirect
      loginAdmin();
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot Password ───────────────────────────────────────
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMsg('');
    if (!forgotEmail.trim()) { setForgotMsg('Please enter your email address.'); return; }

    setForgotLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        forgotEmail.trim().toLowerCase(),
        { redirectTo: `${window.location.origin}/admin/login` }
      );
      if (error) throw error;
      setForgotMsg('Password reset email sent! Check your inbox.');
    } catch (err) {
      setForgotMsg(err.message || 'Could not send reset email. Try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  // ── Left panel (same for all screens) ────────────────────
  const LeftPanel = (
    <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden">
      <div className="absolute top-20 right-20 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl" />
      <div className="relative text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-glow animate-float">
          <GraduationCap size={40} className="text-white" />
        </div>
        <h2 className="text-4xl font-extrabold text-white mb-4">Excellence Coaching</h2>
        <p className="text-white text-lg leading-relaxed mb-8">
          The premium fee management system for modern coaching institutes.
        </p>
        <div className="grid grid-cols-2 gap-4 text-left">
          {['Track all payments', 'Student management', 'Analytics dashboard', 'Mobile responsive'].map((item) => (
            <div key={item} className="glass rounded-xl p-3 flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-accent-400 flex-shrink-0" />
              <span className="text-white text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Loading skeleton ──────────────────────────────────────
  if (setupLoading) {
    return (
      <div className="min-h-screen bg-gradient-navy flex">
        {LeftPanel}
        <div className="flex-1 flex items-center justify-center p-6 lg:bg-silver-100 lg:rounded-l-3xl">
          <div className="w-full max-w-md">
            <div className="lg:card animate-slide-up flex flex-col items-center justify-center gap-4 py-16">
              <svg className="animate-spin h-8 w-8 text-accent-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <p className="text-silver-500 text-sm">Checking admin status…</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state (DB unreachable) ──────────────────────────
  if (setupError) {
    return (
      <div className="min-h-screen bg-gradient-navy flex">
        {LeftPanel}
        <div className="flex-1 flex items-center justify-center p-6 lg:bg-silver-100 lg:rounded-l-3xl">
          <div className="w-full max-w-md">
            <div className="lg:card animate-slide-up">
              <p className="text-red-500 text-sm text-center">{setupError}</p>
              <button onClick={refetch} className="btn-primary w-full justify-center mt-4">Retry</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-navy flex">
      {LeftPanel}

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:bg-silver-100 lg:rounded-l-3xl">
        <div className="w-full max-w-md">
          {/* Back */}
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-silver-500 hover:text-navy-950 mb-8 transition-colors lg:text-navy-700">
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="lg:card animate-slide-up">
            {/* Card header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center shadow-glow lg:hidden">
                <GraduationCap size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white lg:text-navy-950">
                  {!adminExists ? 'Setup Admin Account' : forgotMode ? 'Reset Password' : 'Admin Login'}
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-sm text-silver-500">
                    {!adminExists
                      ? 'Create the administrator account'
                      : forgotMode
                      ? "We'll send a reset link to your email"
                      : 'Sign in to your admin panel'}
                  </p>
                  {adminExists && !forgotMode && <DemoBadge />}
                </div>
              </div>
            </div>

            {/* ── FIRST-TIME SETUP ── */}
            {!adminExists && (
              <SetupAdminForm onSuccess={() => refetch()} />
            )}

            {/* ── FORGOT PASSWORD ── */}
            {adminExists && forgotMode && (
              <form onSubmit={handleForgotPassword} className="space-y-5" noValidate>
                <div>
                  <label className="label text-black lg:text-navy-800">Admin Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-500" />
                    <input
                      id="forgot-email"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="input pl-10"
                      autoComplete="email"
                      disabled={forgotLoading}
                    />
                  </div>
                </div>

                {forgotMsg && (
                  <div className={`text-sm px-4 py-3 rounded-xl border ${
                    forgotMsg.includes('sent')
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : 'bg-red-50 border-red-200 text-red-600'
                  }`}>
                    {forgotMsg}
                  </div>
                )}

                <button
                  type="submit"
                  id="forgot-submit"
                  disabled={forgotLoading}
                  className="btn-primary w-full justify-center py-3 text-base"
                >
                  {forgotLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : 'Send Reset Link'}
                </button>

                <button
                  type="button"
                  onClick={() => { setForgotMode(false); setForgotMsg(''); }}
                  className="w-full text-center text-sm text-accent-500 hover:underline mt-1"
                >
                  ← Back to Login
                </button>
              </form>
            )}

            {/* ── NORMAL LOGIN ── */}
            {adminExists && !forgotMode && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="label text-black lg:text-navy-800">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-500" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="input pl-10"
                      autoComplete="email"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="label text-black lg:text-navy-800">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-500" />
                    <input
                      id="login-password"
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="input pl-10 pr-10"
                      autoComplete="current-password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-silver-500 hover:text-navy-800"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Forgot password link */}
                <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    onClick={() => { setForgotMode(true); setError(''); setForgotEmail(email); }}
                    className="text-xs text-accent-500 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  id="login-submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center py-3 text-base"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : 'Sign In to Admin Panel'}
                </button>

                {/* PWA install button */}
                {installPrompt && (
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="w-full justify-center py-3 text-base flex items-center gap-2 bg-[#84cc16] hover:bg-[#65a30d] text-white font-semibold rounded-xl transition-all duration-300 mt-4 shadow-glow"
                  >
                    <Smartphone size={18} />
                    Install Admin App
                  </button>
                )}
              </form>
            )}

            {/* Student link — always visible */}
            <p className="text-center mt-5 text-sm text-silver-500">
              Are you a student?{' '}
              <Link to="/student/login" className="text-accent-500 font-semibold hover:underline">
                Student Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
