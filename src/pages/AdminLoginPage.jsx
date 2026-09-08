import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, Lock, User, Key, ArrowRight, 
  AlertCircle, CheckCircle2, Store, ShieldAlert, Sparkles 
} from 'lucide-react';

export default function AdminLoginPage() {
  const { login, isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick preset helper for testing
  const handleSelectPreset = (userType) => {
    setError('');
    if (userType === 'owner') {
      setUsername('buddhadev');
      setPassword('Owner@2026');
    } else if (userType === 'coowner') {
      setUsername('lakshmikanta');
      setPassword('Owner@2026');
    } else if (userType === 'staff') {
      setUsername('staff');
      setPassword('Staff@2026');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Invalid credentials.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full">
        {/* Top Branding Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-4 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Store Portal • Buddhadev Bera (Owner) &amp; Lakshmi Kanta Bera (Co-Owner)</span>
          </div>

          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-amber-400 mx-auto mb-4 shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Owner & Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Secure role-based authentication with backend cryptographic authorization.
          </p>
        </div>

        {/* If already logged in banner */}
        {isAuthenticated && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <p className="font-bold text-emerald-900">Signed in as {user.displayName}</p>
                <p className="text-emerald-700 capitalize font-medium">Role: {user.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/admin')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
              >
                Go to Dashboard
              </button>
              <button
                onClick={logout}
                className="bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Main Login Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" /> Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. buddhadev"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-400" /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg disabled:opacity-50 text-sm"
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Sign In Securely</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick-Testing Selector */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5 text-center">
              Quick Role Test Credentials
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset('owner')}
                className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 text-left transition"
              >
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Owner</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Buddhadev Bera</p>
                <span className="text-[9px] text-emerald-700 font-semibold block">Full Rights</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('coowner')}
                className="p-2.5 rounded-xl border border-teal-200 bg-teal-50/50 hover:bg-teal-100 text-left transition"
              >
                <div className="flex items-center gap-1.5 text-teal-800 font-bold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Co-Owner</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Lakshmi Kanta Bera</p>
                <span className="text-[9px] text-teal-700 font-semibold block">Full Rights</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('staff')}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition"
              >
                <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs">
                  <Store className="w-3.5 h-3.5 text-slate-500" />
                  <span>Staff</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Rahul</p>
                <span className="text-[9px] text-slate-500 font-semibold block">Stock Only</span>
              </button>
            </div>
          </div>
        </div>

        {/* Return to Customer Storefront */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs font-semibold text-slate-500 hover:text-emerald-700 transition"
          >
            &larr; Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
