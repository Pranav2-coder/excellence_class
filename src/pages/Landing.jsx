import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, BarChart3, Users, CreditCard, Shield,
  ArrowRight, CheckCircle2, Star, Zap, Bell, FileText,
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
    color: 'text-emerald-500',
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

const PRICING = [
  {
    name: 'Starter',
    price: '₹999',
    period: '/month',
    desc: 'Perfect for small coaching centres',
    features: ['Up to 100 students', 'Basic reports', 'Email support', 'Fee tracking'],
    highlight: false,
  },
  {
    name: 'Professional',
    price: '₹2,499',
    period: '/month',
    desc: 'For growing institutes',
    features: ['Up to 500 students', 'Advanced analytics', 'Priority support', 'Multi-batch', 'SMS reminders'],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For large institutes & chains',
    features: ['Unlimited students', 'Custom reports', 'Dedicated support', 'API access', 'White labelling'],
    highlight: false,
  },
];

const STATS = [
  { label: 'Institutes using EduPay', value: '1,200+' },
  { label: 'Fees processed monthly',  value: '₹18 Cr+' },
  { label: 'Students managed',        value: '2.5 Lakh+' },
  { label: 'Uptime guarantee',        value: '99.9%' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-silver-300/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-accent rounded-xl flex items-center justify-center shadow-glow">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg text-navy-950">EduPay <span className="gradient-text">Pro</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-silver-600">
            <a href="#features" className="hover:text-navy-950 transition-colors">Features</a>
            <a href="#pricing"  className="hover:text-navy-950 transition-colors">Pricing</a>
            <a href="#stats"    className="hover:text-navy-950 transition-colors">About</a>
          </div>

          <div className="flex items-center gap-3">
            <DemoBadge />
            <button onClick={() => navigate('/student/login')} className="btn-secondary hidden sm:flex">
              Student Login
            </button>
            <button onClick={() => navigate('/admin/login')} className="btn-primary">
              Admin Login
              <ArrowRight size={15} />
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm font-medium text-slate-300">
              <Zap size={14} className="text-accent-400" />
              Trusted by 1,200+ coaching institutes across India
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Fee Management{' '}
              <span className="gradient-text">Made Effortless</span>{' '}
              for Coaching Institutes
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              A modern, all-in-one platform to manage students, track fee collections,
              generate reports, and streamline your institute's finances.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/admin/login')}
                className="btn-primary text-base px-8 py-3.5 justify-center shadow-glow"
              >
                Admin Demo Login
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/student/login')}
                className="glass text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/15 transition-all duration-200 flex items-center justify-center gap-2 text-base"
              >
                <Users size={18} />
                Student Demo Login
              </button>
            </div>

            {/* Credentials hint */}
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <div className="glass rounded-xl px-5 py-3 text-xs text-slate-300">
                <span className="text-slate-400">Admin: </span>
                <span className="font-mono font-semibold text-accent-300">admin@demo.com</span>
                <span className="text-slate-400 mx-2">/</span>
                <span className="font-mono font-semibold text-accent-300">admin123</span>
              </div>
              <div className="glass rounded-xl px-5 py-3 text-xs text-slate-300">
                <span className="text-slate-400">Student ID: </span>
                <span className="font-mono font-semibold text-accent-300">STU001</span>
                <span className="text-slate-400 mx-2">/</span>
                <span className="font-mono font-semibold text-accent-300">stu001</span>
              </div>
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
                <p className="text-sm text-slate-400">{s.label}</p>
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

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-accent-500 font-semibold text-sm uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy-950 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-silver-600 text-lg max-w-xl mx-auto">
              No hidden fees. Scale as you grow. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                  plan.highlight
                    ? 'bg-gradient-navy text-white shadow-2xl scale-105'
                    : 'card'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge-info flex items-center gap-1 text-xs font-bold">
                      <Star size={11} fill="#6366f1" />
                      Most Popular
                    </span>
                  </div>
                )}
                <p className={`font-bold text-base mb-1 ${plan.highlight ? 'text-slate-300' : 'text-silver-600'}`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-2">
                  <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-white' : 'text-navy-950'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm mb-1 ${plan.highlight ? 'text-slate-400' : 'text-silver-500'}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`text-sm mb-6 ${plan.highlight ? 'text-slate-400' : 'text-silver-500'}`}>
                  {plan.desc}
                </p>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 size={15} className={plan.highlight ? 'text-accent-300' : 'text-emerald-500'} />
                      <span className={plan.highlight ? 'text-slate-200' : 'text-navy-800'}>{feat}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/admin/login')}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.highlight
                      ? 'bg-accent-500 hover:bg-accent-400 text-white shadow-glow'
                      : 'border border-silver-300 hover:border-accent-400 hover:text-accent-500 text-navy-800'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-gradient-accent py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to modernise your institute?
          </h2>
          <p className="text-indigo-200 text-lg mb-8">
            Try the live demo — no signup required.
          </p>
          <button
            onClick={() => navigate('/admin/login')}
            className="bg-white text-accent-600 font-bold px-10 py-4 rounded-xl hover:bg-silver-100 transition-all duration-200 shadow-lg text-base inline-flex items-center gap-2"
          >
            Try Admin Demo <ArrowRight size={18} />
          </button>
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
              <span className="text-white font-bold">EduPay Pro</span>
              <DemoBadge />
            </div>
            <p className="text-slate-500 text-sm">
              © 2024 EduPay Pro. Client Demo. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <Globe size={16} />
              <Smartphone size={16} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
