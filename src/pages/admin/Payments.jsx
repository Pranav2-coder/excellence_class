import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Search, Eye } from 'lucide-react';

import Sidebar    from '../../components/Sidebar';
import DemoBadge  from '../../components/DemoBadge';
import { useApp } from '../../hooks/useApp';
import { formatCurrency, formatDate } from '../../data/mockData';

export default function PaymentsPage() {
  const { getRecentPayments } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const all = getRecentPayments(200);
  const filtered = all.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.studentName.toLowerCase().includes(q) ||
      p.studentId.toLowerCase().includes(q) ||
      p.mode.toLowerCase().includes(q)
    );
  });

  const total = filtered.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="flex h-screen overflow-hidden bg-silver-100">
      <Sidebar />

      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Top bar */}
        <div className="topbar">
          <div className="lg:pl-0 pl-12 flex items-center gap-2 min-w-0">
            <CreditCard size={22} className="text-accent-500 flex-shrink-0" />
            <h1 className="text-xl lg:text-2xl font-black text-navy-900 tracking-tight truncate">All Payments</h1>
            <span className="badge-info ml-1 flex-shrink-0">{filtered.length}</span>
          </div>
          <DemoBadge />
        </div>

        <div className="page-content space-y-4">
          {/* Summary + Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="card flex-1 flex items-center gap-4 py-4 animate-slide-up">
              <div className="bg-emerald-50 p-3 rounded-xl">
                <CreditCard size={22} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-silver-500 font-medium">Total Shown</p>
                <p className="text-xl font-bold text-emerald-600">{formatCurrency(total)}</p>
              </div>
            </div>
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-500" />
              <input
                className="input !pl-10 bg-white h-full"
                placeholder="Search by student, ID, or mode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="card p-0 overflow-hidden animate-fade-in">
            <div className="table-wrapper border-0 rounded-2xl">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Receipt</th>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Mode</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-silver-400">
                        No payments found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p, i) => (
                      <tr key={`${p.id}-${i}`}>
                        <td className="text-silver-400 text-xs">{i + 1}</td>
                        <td className="font-mono text-xs text-silver-500">{p.id}</td>
                        <td>
                          <p className="font-semibold text-navy-950 text-sm">{p.studentName}</p>
                          <p className="text-xs text-silver-400 font-mono">{p.studentId}</p>
                        </td>
                        <td><span className="badge-info">{p.course}</span></td>
                        <td className="font-bold text-emerald-600">{formatCurrency(p.amount)}</td>
                        <td className="text-sm text-silver-600">{formatDate(p.date)}</td>
                        <td><span className="badge-success">{p.mode}</span></td>
                        <td>
                          <button
                            onClick={() => navigate(`/admin/students/${p.studentId}`)}
                            className="btn-ghost text-accent-500 hover:bg-accent-50"
                          >
                            <Eye size={14} /> View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
