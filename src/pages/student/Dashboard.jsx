import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, Phone, BookOpen, CalendarDays,
  LogOut, IndianRupee, CheckCircle2, AlertTriangle,
  CreditCard, TrendingUp, Clock
} from 'lucide-react';

import ProgressBar from '../../components/ProgressBar';
import DemoBadge   from '../../components/DemoBadge';
import { useApp }  from '../../context/AppContext';
import { formatCurrency, formatDate, calcPaid, calcRemaining } from '../../data/mockData';

export default function StudentDashboard() {
  const { studentAuth, logoutStudent, getStudent } = useApp();
  const navigate = useNavigate();

  const student = getStudent(studentAuth?.id);

  // Guard: if student data is missing, log out and redirect
  if (!student) {
    logoutStudent();
    navigate('/student/login', { replace: true });
    return null;
  }

  const paid      = calcPaid(student);
  const remaining = calcRemaining(student);
  const pct       = Math.min(100, Math.round((paid / student.yearlyFee) * 100));
  const sorted    = [...student.payments].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleLogout = () => {
    logoutStudent();
    navigate('/student/login');
  };

  const statusColor =
    pct === 100 ? 'success' :
    pct >= 60   ? 'accent'  :
    pct >= 30   ? 'warning' :
                  'danger';

  const statusLabel =
    pct === 100 ? 'Fully Paid 🎉' :
    pct >= 60   ? 'On Track'       :
    pct >= 30   ? 'Partially Paid' :
                  'Overdue';

  const statusBadge =
    pct === 100 ? 'badge-success' :
    pct >= 60   ? 'badge-info'    :
    pct >= 30   ? 'badge-warning' :
                  'badge-danger';

  return (
    <div className="min-h-screen bg-silver-100">
      {/* Navbar */}
      <nav className="bg-gradient-navy sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-accent rounded-xl flex items-center justify-center shadow-glow">
              <GraduationCap size={18} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">EduPay Pro</span>
              <span className="text-slate-400 text-xs ml-2 hidden sm:inline">Student Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DemoBadge />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition-colors text-sm font-medium"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Welcome card */}
        <div className="bg-gradient-navy rounded-2xl p-6 sm:p-8 relative overflow-hidden animate-fade-in">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-500/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Welcome back,</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{student.name} 👋</h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="glass text-slate-300 text-xs font-mono px-3 py-1 rounded-lg">{student.id}</span>
                <span className="glass text-slate-300 text-xs px-3 py-1 rounded-lg flex items-center gap-1">
                  <BookOpen size={12} /> {student.course}
                </span>
                <span className={statusBadge}>{statusLabel}</span>
              </div>
            </div>
            <div className="w-14 h-14 bg-gradient-accent rounded-2xl flex items-center justify-center shadow-glow flex-shrink-0">
              <span className="text-white text-2xl font-extrabold">{student.name[0]}</span>
            </div>
          </div>
        </div>

        {/* Fee status cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="card text-center animate-slide-up">
            <div className="bg-navy-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
              <IndianRupee size={22} className="text-navy-900" />
            </div>
            <p className="text-xs text-silver-500 mb-1">Yearly Fee</p>
            <p className="text-2xl font-extrabold text-navy-950">{formatCurrency(student.yearlyFee)}</p>
          </div>

          <div className="card text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp size={22} className="text-emerald-500" />
            </div>
            <p className="text-xs text-emerald-600 mb-1">Paid Amount</p>
            <p className="text-2xl font-extrabold text-emerald-600">{formatCurrency(paid)}</p>
          </div>

          <div className="card text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${remaining > 0 ? 'bg-red-50' : 'bg-emerald-50'}`}>
              <Clock size={22} className={remaining > 0 ? 'text-red-500' : 'text-emerald-500'} />
            </div>
            <p className={`text-xs mb-1 ${remaining > 0 ? 'text-red-500' : 'text-emerald-600'}`}>Remaining</p>
            <p className={`text-2xl font-extrabold ${remaining > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
              {remaining > 0 ? formatCurrency(remaining) : '✓ Cleared!'}
            </p>
          </div>
        </div>

        {/* Progress card */}
        <div className="card animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-navy-950 text-base">Fee Completion Progress</h2>
              <p className="text-xs text-silver-500 mt-0.5">Academic Year 2024–25</p>
            </div>
            <span className={statusBadge + ' text-sm px-3 py-1.5'}>{statusLabel}</span>
          </div>

          {/* Big percentage display */}
          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl font-black text-navy-950">{pct}%</span>
            <span className="text-silver-500 text-sm mb-2">of ₹{(student.yearlyFee / 1000).toFixed(0)}K paid</span>
          </div>

          <ProgressBar value={paid} max={student.yearlyFee} />

          <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-silver-200">
            <div className="text-center">
              <p className="text-xl font-bold text-navy-950">{student.payments.length}</p>
              <p className="text-xs text-silver-500 mt-0.5">Payments Made</p>
            </div>
            <div className="text-center border-x border-silver-200">
              <p className="text-xl font-bold text-emerald-600">{formatCurrency(paid / (student.payments.length || 1))}</p>
              <p className="text-xs text-silver-500 mt-0.5">Avg. per Payment</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-navy-950">{formatDate(student.joinDate)}</p>
              <p className="text-xs text-silver-500 mt-0.5">Enrolled On</p>
            </div>
          </div>

          {pct === 100 && (
            <div className="mt-5 flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
              <CheckCircle2 size={22} className="text-emerald-500 flex-shrink-0" />
              <div>
                <p className="font-bold text-emerald-700">Congratulations!</p>
                <p className="text-sm text-emerald-600">All fees for this academic year have been fully paid.</p>
              </div>
            </div>
          )}
          {remaining > 0 && remaining < student.yearlyFee * 0.25 && (
            <div className="mt-5 flex items-center gap-3 p-4 bg-amber-50 rounded-xl">
              <AlertTriangle size={22} className="text-amber-500 flex-shrink-0" />
              <div>
                <p className="font-bold text-amber-700">Almost there!</p>
                <p className="text-sm text-amber-600">Only {formatCurrency(remaining)} remaining. Contact admin to pay.</p>
              </div>
            </div>
          )}
          {remaining > student.yearlyFee * 0.25 && (
            <div className="mt-5 flex items-center gap-3 p-4 bg-red-50 rounded-xl">
              <AlertTriangle size={22} className="text-red-500 flex-shrink-0" />
              <div>
                <p className="font-bold text-red-700">Pending Balance</p>
                <p className="text-sm text-red-600">{formatCurrency(remaining)} is pending. Please contact the admin office.</p>
              </div>
            </div>
          )}
        </div>

        {/* Student info */}
        <div className="card animate-fade-in">
          <h2 className="font-bold text-navy-950 mb-4">My Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Phone,        label: 'Mobile',       value: student.mobile     },
              { icon: BookOpen,     label: 'Course',       value: student.course     },
              { icon: CalendarDays, label: 'Joined',       value: formatDate(student.joinDate) },
              { icon: GraduationCap,label: 'Student ID',   value: student.id         },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-3 bg-silver-100 rounded-xl">
                <div className="bg-accent-50 p-2.5 rounded-xl">
                  <Icon size={16} className="text-accent-500" />
                </div>
                <div>
                  <p className="text-xs text-silver-500">{label}</p>
                  <p className="font-semibold text-navy-800 text-sm">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment history */}
        <div className="card animate-fade-in">
          <div className="flex items-center gap-2 mb-5">
            <CreditCard size={18} className="text-accent-500" />
            <h2 className="font-bold text-navy-950">Payment History</h2>
            <span className="badge-info ml-1">{sorted.length}</span>
          </div>

          {sorted.length === 0 ? (
            <div className="text-center py-10 text-silver-400">
              <CreditCard size={36} className="mx-auto mb-3 opacity-40" />
              <p>No payments yet. Please contact admin.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 bg-silver-100 rounded-xl hover:bg-silver-200/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy-950 text-sm">{formatCurrency(p.amount)}</p>
                      <p className="text-xs text-silver-500">{formatDate(p.date)} · via {p.mode}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="badge-success">Paid</span>
                    {p.note && <p className="text-xs text-silver-400 mt-1">{p.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
