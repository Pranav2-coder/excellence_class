import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, UserPlus, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * SetupAdminForm — shown only when NO admin exists yet.
 * Registers the one-and-only admin via Supabase Auth, then inserts
 * a row in admin_profiles (user_id, email, role).  Password is
 * NEVER stored outside Supabase Auth.
 *
 * Props:
 *   onSuccess: () => void  — called after successful creation
 */
export default function SetupAdminForm({ onSuccess }) {
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [confirmPw,   setConfirmPw]   = useState('');
  const [showPw,      setShowPw]      = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState('');
  const [loading,     setLoading]     = useState(false);

  // ── Validation ──────────────────────────────────────────────
  const validate = () => {
    if (!email.trim())                    return 'Email is required.';
    if (!EMAIL_REGEX.test(email.trim()))  return 'Please enter a valid email address.';
    if (password.length < 8)             return 'Password must be at least 8 characters.';
    if (password !== confirmPw)          return 'Passwords do not match.';
    return null;
  };

  // ── Submit ───────────────────────────────────────────────────
  const handleSetup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      // 1. Register via Supabase Auth — password handled exclusively by Supabase
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signUpError) throw signUpError;

      const userId = authData?.user?.id;
      if (!userId) throw new Error('User creation failed. Please try again.');

      // 2. Insert profile record (no password stored)
      const { error: profileError } = await supabase
        .from('admin_profiles')
        .insert([{
          user_id: userId,
          email:   email.trim().toLowerCase(),
          role:    'admin',
        }]);

      if (profileError) {
        // Roll back: sign the new user out so they can't access anything
        await supabase.auth.signOut();
        throw profileError;
      }

      // 3. Sign out immediately — they must log in properly
      await supabase.auth.signOut();

      setSuccess('Admin account created! You can now log in below.');
      setTimeout(() => onSuccess(), 1800);
    } catch (err) {
      console.error('[SetupAdminForm] Error:', err);
      setError(err.message || 'Setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSetup} className="space-y-5" noValidate>
      {/* Header badge */}
      <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-accent-500/10 border border-accent-500/30 rounded-xl">
        <ShieldCheck size={15} className="text-accent-500 flex-shrink-0" />
        <p className="text-xs text-accent-600 font-medium leading-snug">
          First-time setup — create the one admin account for this portal.
        </p>
      </div>

      {/* Email */}
      <div>
        <label className="label text-black lg:text-navy-800">Admin Email Address</label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-500" />
          <input
            id="setup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@yourschool.com"
            className="input !pl-10"
            autoComplete="email"
            disabled={loading}
            required
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="label text-black lg:text-navy-800">Password <span className="text-silver-400 font-normal">(min 8 chars)</span></label>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-500" />
          <input
            id="setup-password"
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            className="input !pl-10 !pr-10"
            autoComplete="new-password"
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-silver-500 hover:text-navy-800"
            tabIndex={-1}
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="label text-black lg:text-navy-800">Confirm Password</label>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-500" />
          <input
            id="setup-confirm-password"
            type={showConfirm ? 'text' : 'password'}
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="Re-enter your password"
            className="input !pl-10 !pr-10"
            autoComplete="new-password"
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-silver-500 hover:text-navy-800"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
          {success}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        id="setup-submit"
        disabled={loading}
        className="btn-primary w-full justify-center py-3 text-base"
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <span className="flex items-center gap-2 justify-center">
            <UserPlus size={18} />
            Create Admin Account
          </span>
        )}
      </button>
    </form>
  );
}
