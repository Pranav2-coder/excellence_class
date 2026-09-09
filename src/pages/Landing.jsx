import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, BarChart3, Users, CreditCard, Shield,
  Bell, FileText, Globe, Smartphone
} from 'lucide-react';
import DemoBadge from '../components/DemoBadge';
import { useApp } from '../hooks/useApp';

const FEATURES = [
  {
    icon: Users,
    title: 'Student co-ordination',
    desc: 'student can ask doubts and question semlessly, and teachers can answer them in one place.',
    color: 'text-accent-500',
    bg: 'bg-accent-50',
  },
  {
    icon: CreditCard,
    title: 'Better Collaboration of teachers and students',
    desc: 'Teachers can track student payments, send reminders, and update fee records seamlessly.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: BarChart3,
    title: 'PYQ Distribution',
    desc: 'Access a comprehensive collection of previous year questions for effective exam preparation.',
    color: 'text-violet-500',
    bg: 'bg-violet-50',
  },
  {
    icon: Bell,
    title: 'Parents meeting',
    desc: 'Schedule and manage parent-teacher meetings with ease.',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    icon: Shield,
    title: 'Modern Classroom',
    desc: 'Create a secure and interactive classroom environment for students and teachers.',
    color: 'text-sky-500',
    bg: 'bg-sky-50',
  },
  {
    icon: FileText,
    title: 'Experienced staff',
    desc: 'Our team of experienced staff ensures smooth operations .',
    color: 'text-rose-500',
    bg: 'bg-rose-50',
  },
];

const STATS = [
  { label: 'Facility', value: 'A+' },
  { label: 'Students enrolled',  value: '2,000+' },
  { label: 'more than 90%',        value: '500+' },
  { label: 'Passing rate',        value: '100%' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { canInstallStudentApp, installApp } = useApp();

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
              excellence Coaching{' '}
              <span className="gradient-text">Made Effortless</span>{' '}
              for students
            </h1>

            <p className="text-lg md:text-xl text-white mb-10 leading-relaxed max-w-2xl mx-auto">
             A coaching for the student that having the best features for the student ,helps to increase the marks in curicullum and other things in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/student/login')}
                className="glass text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/15 transition-all duration-200 flex items-center justify-center gap-2 text-base"
              >
                <Users size={18} />
                Student Login
              </button>

              {canInstallStudentApp && (
                <button
                  onClick={installApp}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base bg-accent-500 hover:bg-accent-600 text-white transition-all duration-200 shadow-glow"
                >
                  <Smartphone size={18} />
                  Install Student App
                </button>
              )}
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
              Everything you need 
            </h2>
            <p className="text-silver-600 text-lg max-w-xl mx-auto">
              From student onboarding to study doubts and parent-teacher meetings, our platform has it all.
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
              © 2026 Excellence Coaching. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-white">
              <Globe size={16} />
              {canInstallStudentApp ? (
                <button
                  onClick={installApp}
                  className="flex items-center gap-1.5 text-xs font-semibold text-accent-400 hover:text-accent-300 transition-colors"
                >
                  <Smartphone size={15} />
                  Install Student App
                </button>
              ) : (
                <Smartphone size={16} />
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
