import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, BarChart3, Users, CreditCard, Shield,
  ArrowRight, Zap, Bell, FileText,
  ChevronRight, Globe, Smartphone
} from 'lucide-react';
import DemoBadge from '../components/DemoBadge';

const FEATURES = [
  {
    icon: Users,
    title: 'Student Management',
    desc: 'Effortlessly manage student profiles, courses, and contact details in one place.',
    color: 'text-accent-500',
    bg: 'bg-accent-50',
  },
  {
    icon: CreditCard,
    title: 'Fee Collection & Tracking',
    desc: 'Record and track fee payments with instant updates to balances and reports.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    desc: 'Visualise collections, pending fees, and growth trends with beautiful charts.',
    color: 'text-violet-500',
    bg: 'bg-violet-50',
  },
  {
    icon: Bell,
    title: 'Payment Reminders',
    desc: 'Automated reminders for due payments reduce manual follow-up work.',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    desc: 'Separate logins for admins and students with data privacy built in.',
    color: 'text-sky-500',
    bg: 'bg-sky-50',
  },
  {
    icon: FileText,
    title: 'Receipt & Reports',
    desc: 'Generate and download payment receipts and monthly fee reports instantly.',
    color: 'text-rose-500',
    bg: 'bg-rose-50',
  },
];

const STATS = [
  { label: 'Institutes using Excellence Coaching', value: '1,200+' },
  { label: 'Fees processed monthly',  value: '₹18 Cr+' },
  { label: 'Students managed',        value: '2.5 Lakh+' },
  { label: 'Uptime guarantee',        value: '99.9%' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setInstallPrompt(null);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-silver-300/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-accent rounded-xl flex items-center justify-center shadow-glow">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg text-navy-950">Excellence <span className="gradient-text">Coaching</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-silver-600">
            <a href="#features" className="hover:text-navy-950 transition-colors">Features</a>
            <a href="#stats"    className="hover:text-navy-950 transition-colors">About</a>
          </div>

          <div className="flex items-center gap-3">
            <DemoBadge />

            {installPrompt && (
              <button onClick={handleInstallClick} className="bg-[#84cc16] hover:bg-[#65a30d] text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                <Smartphone size={16} />
                Install
              </button>
            )}

            <button onClick={() => navigate('/student/login')} className="btn-secondary hidden sm:flex">
              Student Login
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-navy">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-800/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">


            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Fee Management{' '}
              <span className="gradient-text">Made Effortless</span>{' '}
              for Coaching Institutes
            </h1>

            <p className="text-lg md:text-xl text-white mb-10 leading-relaxed max-w-2xl mx-auto">
              A modern, all-in-one platform to manage students, track fee collections,
              generate reports, and streamline your institute's finances.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              
              {installPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="bg-[#84cc16] hover:bg-[#65a30d] text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-base shadow-glow"
                >
                  <Smartphone size={18} />
                  Install App
                </button>
              )}

              <button
                onClick={() => navigate('/student/login')}
                className="glass text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/15 transition-all duration-200 flex items-center justify-center gap-2 text-base"
              >
                <Users size={18} />
                Student Login
              </button>
            </div>


          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section id="stats" className="bg-navy-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-2xl md:text-3xl font-extrabold text-white mb-1">{s.value}</p>
                <p className="text-sm text-white">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 md:py-28 bg-silver-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-accent-500 font-semibold text-sm uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy-950 mb-4">
              Everything you need to manage fees
            </h2>
            <p className="text-silver-600 text-lg max-w-xl mx-auto">
              From student onboarding to payment receipts — all in one premium platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="card-hover group">
                <div className={`${f.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-5`}>
                  <f.icon size={22} className={f.color} />
                </div>
                <h3 className="font-bold text-navy-950 text-base mb-2">{f.title}</h3>
                <p className="text-silver-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-navy-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                <GraduationCap size={16} className="text-white" />
              </div>
              <span className="text-white font-bold">Excellence Coaching</span>
              <DemoBadge />
            </div>
            <p className="text-white text-sm">
              © 2024 Excellence Coaching. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-white">
              <Globe size={16} />
              <Smartphone size={16} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
