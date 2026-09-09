import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Phone, BookOpen, CalendarDays,
  Plus, IndianRupee, CreditCard, CheckCircle2,
  AlertTriangle, Receipt, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

import Sidebar     from '../../components/Sidebar';
import Modal       from '../../components/Modal';
import ProgressBar from '../../components/ProgressBar';
import DemoBadge   from '../../components/DemoBadge';
import { useApp } from '../../hooks/useApp';
import {
  formatCurrency, formatDate, calcPaid, calcRemaining, PAYMENT_MODES
} from '../../data/mockData';

function AddPaymentModal({ isOpen, onClose, studentId }) {
  const { addPayment } = useApp();
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    amount: '',
    date:   today,
    mode:   PAYMENT_MODES[0],
    note:   '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid amount';
    if (!form.date) e.date = 'Select a date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await addPayment(studentId, {
        amount: Number(form.amount),
        date:   form.date,
        mode:   form.mode,
        note:   form.note,
      });
      toast.success(`✅ Payment of ${formatCurrency(Number(form.amount))} recorded!`);
      setForm({ amount: '', date: today, mode: PAYMENT_MODES[0], note: '' });
      setErrors({});
      onClose();
    } catch {
      toast.error('Failed to save payment to database.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Payment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Amount (₹) *</label>
          <div className="relative">
            <IndianRupee size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-500" />
            <input
              className={`input !pl-10 ${errors.amount ? 'border-rose-500' : ''}`}
              placeholder="Enter amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          {errors.amount && <p className="text-rose-500 text-xs mt-1">{errors.amount}</p>}
        </div>

        <div>
          <label className="label">Payment Date *</label>
          <div className="relative">
            <CalendarDays size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-500" />
            <input
              type="date"
              className={`input !pl-10 ${errors.date ? 'border-rose-500' : ''}`}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          {errors.date && <p className="text-rose-500 text-xs mt-1">{errors.date}</p>}
        </div>

        <div>
          <label className="label">Payment Mode *</label>
          <div className="relative">
            <CreditCard size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-500" />
            <select
              className="input !pl-10"
              value={form.mode}
              onChange={(e) => setForm({ ...form, mode: e.target.value })}
            >
              {PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Note (optional)</label>
          <input
            className="input"
            placeholder="e.g. Q2 Installment"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button type="submit" className="btn-primary flex-1 justify-center">Save Payment</button>
        </div>
      </form>
    </Modal>
  );
}

export default function StudentDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { getStudent, deleteStudent } = useApp();
  const [payOpen, setPayOpen] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete this student? This action cannot be undone.`)) {
      try {
        await deleteStudent(id);
        navigate('/admin/students');
      } catch {
        toast.error('Failed to delete student from database.');
      }
    }
  };

  const student = getStudent(id);

  if (!student) {
    return (
      <div className="flex h-screen overflow-hidden bg-silver-100">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-navy-950 mb-2">Student Not Found</h2>
            <button onClick={() => navigate('/admin/students')} className="btn-primary">
              ← Back to Students
            </button>
          </div>
        </main>
      </div>
    );
  }

  const paid      = calcPaid(student);
  const remaining = calcRemaining(student);
  const pct       = Math.round((paid / student.yearlyFee) * 100);
  const sorted    = [...student.payments].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="flex h-screen overflow-hidden bg-silver-100">
      <Sidebar />
      <AddPaymentModal isOpen={payOpen} onClose={() => setPayOpen(false)} studentId={id} />

      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Top bar */}
        <div className="topbar">
          <div className="lg:pl-0 pl-12 flex items-center gap-2 min-w-0">
            <button onClick={() => navigate('/admin/students')} className="btn-ghost p-2 flex-shrink-0">
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg lg:text-2xl font-black text-navy-900 tracking-tight truncate">{student.name}</h1>
              <p className="text-xs text-silver-500 font-mono mt-0.5 hidden sm:block">{student.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <DemoBadge />
            <button
              onClick={handleDelete}
              className="btn-ghost text-rose-500 hover:bg-rose-50 hover:text-rose-600 p-2"
              title="Delete student"
            >
              <Trash2 size={18} />
            </button>
            <button onClick={() => setPayOpen(true)} className="btn-primary">
              <Plus size={16} />
              <span className="hidden sm:inline">Add Payment</span>
            </button>
          </div>
        </div>

        <div className="page-content space-y-5">
          {/* Student info + fee summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Info card */}
            <div className="card lg:col-span-1 animate-slide-up">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-gradient-accent rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow">
                  <span className="text-white text-2xl font-extrabold">{student.name[0]}</span>
                </div>
                <div>
                  <h2 className="font-bold text-navy-950 text-lg">{student.name}</h2>
                  <p className="text-silver-500 text-sm font-mono">{student.id}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={15} className="text-silver-400 flex-shrink-0" />
                  <span className="text-navy-800 font-medium">{student.mobile}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <BookOpen size={15} className="text-silver-400 flex-shrink-0" />
                  <span className="badge-info">{student.course}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CalendarDays size={15} className="text-silver-400 flex-shrink-0" />
                  <span className="text-navy-800 font-medium">Joined {formatDate(student.joinDate)}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-silver-200">
                <div className="bg-silver-100 rounded-xl p-3 mb-4 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-silver-500 tracking-wider">Login Credentials</p>
                    <p className="text-sm font-mono font-medium text-navy-900 mt-0.5">ID: {student.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-silver-500 tracking-wider">Password</p>
                    <p className="text-sm font-mono font-medium text-navy-900 mt-0.5">{student.password}</p>
                  </div>
                </div>
                <p className="text-xs text-silver-500 mb-1">Total Payments Made</p>
                <p className="text-2xl font-extrabold text-navy-950">{student.payments.length}</p>
              </div>
            </div>

            {/* Fee summary */}
            <div className="card lg:col-span-2 animate-slide-up">
              <h2 className="font-bold text-navy-950 mb-5">Fee Summary</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-silver-100 rounded-xl">
                  <p className="text-xs text-silver-500 mb-1">Yearly Fee</p>
                  <p className="text-xl font-extrabold text-navy-950">{formatCurrency(student.yearlyFee)}</p>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-xl">
                  <p className="text-xs text-emerald-600 mb-1 font-semibold">Paid</p>
                  <p className="text-xl font-extrabold text-emerald-600">{formatCurrency(paid)}</p>
                </div>
                <div className={`text-center p-4 rounded-xl ${remaining > 0 ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                  <p className={`text-xs mb-1 font-semibold ${remaining > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>Remaining</p>
                  <p className={`text-xl font-extrabold ${remaining > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {remaining > 0 ? formatCurrency(remaining) : '✓ Clear'}
                  </p>
                </div>
              </div>

              <ProgressBar value={paid} max={student.yearlyFee} label={`Fee Completion — ${pct}%`} />

              {remaining === 0 && (
                <div className="mt-4 flex items-center gap-2 p-3 bg-emerald-50 rounded-xl">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span className="text-emerald-700 text-sm font-semibold">All fees have been cleared! 🎉</span>
                </div>
              )}
              {remaining > 0 && remaining < student.yearlyFee * 0.3 && (
                <div className="mt-4 flex items-center gap-2 p-3 bg-amber-50 rounded-xl">
                  <AlertTriangle size={18} className="text-amber-500" />
                  <span className="text-amber-700 text-sm font-semibold">
                    Almost there! Only {formatCurrency(remaining)} remaining.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Payment history */}
          <div className="card animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Receipt size={18} className="text-accent-500" />
                <h2 className="font-bold text-navy-950">Payment History</h2>
              </div>
              <button onClick={() => setPayOpen(true)} className="btn-primary text-xs px-3 py-2">
                <Plus size={14} />
                Add Payment
              </button>
            </div>

            {sorted.length === 0 ? (
              <div className="text-center py-10 text-silver-400">
                <CreditCard size={36} className="mx-auto mb-3 opacity-40" />
                <p>No payments recorded yet.</p>
                <button onClick={() => setPayOpen(true)} className="btn-primary mt-4 mx-auto">
                  Record First Payment
                </button>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Receipt ID</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Mode</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((p, i) => (
                      <tr key={p.id}>
                        <td className="text-silver-500 text-xs">{sorted.length - i}</td>
                        <td className="font-mono text-xs text-silver-600">{p.id}</td>
                        <td className="font-bold text-emerald-600">{formatCurrency(p.amount)}</td>
                        <td className="text-sm text-silver-600">{formatDate(p.date)}</td>
                        <td><span className="badge-success">{p.mode}</span></td>
                        <td className="text-sm text-silver-500">{p.note || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
