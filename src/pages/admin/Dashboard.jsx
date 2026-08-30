import {
  Users, IndianRupee, TrendingUp, Clock,
  Bell, Search, ChevronRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

import Sidebar    from '../../components/Sidebar';
import StatCard   from '../../components/StatCard';
import DemoBadge  from '../../components/DemoBadge';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate, MONTHLY_CHART_DATA, COURSE_CHART_DATA } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-950 text-white px-4 py-3 rounded-xl text-xs shadow-xl border border-white/10">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const { getTotals, getRecentPayments } = useApp();
  const navigate = useNavigate();
  const totals   = getTotals();
  const recent   = getRecentPayments(7);

  const CARDS = [
    {
      title:    'Total Students',
      value:    totals.totalStudents,
      icon:     Users,
      color:    'accent',
      trend:    12,
      subtitle: 'Active enrolled students',
    },
    {
      title:    'Total Fees',
      value:    formatCurrency(totals.totalFees),
      icon:     IndianRupee,
      color:    'navy',
      subtitle: 'Annual fee target',
    },
    {
      title:    'Fees Collected',
      value:    formatCurrency(totals.totalCollected),
      icon:     TrendingUp,
      color:    'success',
      trend:    8,
      subtitle: `${Math.round((totals.totalCollected / totals.totalFees) * 100)}% of target achieved`,
    },
    {
      title:    'Pending Fees',
      value:    formatCurrency(totals.totalPending),
      icon:     Clock,
      color:    'warning',
      subtitle: 'Outstanding balance',
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-silver-100">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-silver-300/60 px-6 py-4 flex items-center justify-between">
          <div className="lg:pl-0 pl-12">
            <h1 className="text-xl font-bold text-navy-950">Dashboard</h1>
            <p className="text-sm text-silver-500">Welcome back, Admin 👋</p>
          </div>
          <div className="flex items-center gap-3">
            <DemoBadge />
            <button className="relative p-2 rounded-xl hover:bg-silver-200 transition-colors text-silver-600">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full" />
            </button>
            <div className="w-9 h-9 bg-gradient-accent rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {CARDS.map((c) => (
              <StatCard key={c.title} {...c} />
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Area chart */}
            <div className="lg:col-span-2 card animate-fade-in">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-navy-950">Fee Collection Trend</h2>
                  <p className="text-xs text-silver-500 mt-0.5">Last 6 months — collected vs target</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={MONTHLY_CHART_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
                    </linearGradient>
                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `₹${v / 1000}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                  <Area type="monotone" dataKey="target"    name="Target"    stroke="#10b981" fill="url(#colorTarget)"    strokeWidth={2} strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="collected" name="Collected" stroke="#6366f1" fill="url(#colorCollected)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart */}
            <div className="card animate-fade-in">
              <h2 className="font-bold text-navy-950 mb-1">Students by Course</h2>
              <p className="text-xs text-silver-500 mb-4">Distribution across batches</p>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={COURSE_CHART_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {COURSE_CHART_DATA.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => `${val}%`} contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {COURSE_CHART_DATA.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs text-navy-800">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                    <span className="truncate">{d.name}</span>
                    <span className="ml-auto font-semibold text-silver-500">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent payments table */}
          <div className="card animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-navy-950">Recent Payments</h2>
                <p className="text-xs text-silver-500 mt-0.5">Latest fee transactions</p>
              </div>
              <button
                onClick={() => navigate('/admin/payments')}
                className="btn-ghost text-accent-500 hover:bg-accent-50"
              >
                View All <ChevronRight size={15} />
              </button>
            </div>

            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Amount</th>
                    <th>Mode</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((p) => (
                    <tr
                      key={p.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/admin/students/${p.studentId}`)}
                    >
                      <td>
                        <div>
                          <p className="font-semibold text-navy-950 text-sm">{p.studentName}</p>
                          <p className="text-xs text-silver-500">{p.studentId}</p>
                        </div>
                      </td>
                      <td><span className="badge-info">{p.course}</span></td>
                      <td className="font-bold text-emerald-600">{formatCurrency(p.amount)}</td>
                      <td><span className="badge-success">{p.mode}</span></td>
                      <td className="text-silver-600 text-sm">{formatDate(p.date)}</td>
                      <td><span className="badge-success">✓ Received</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
