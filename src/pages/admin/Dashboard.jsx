import {
  Users, IndianRupee, TrendingUp, Clock,
  Bell, ChevronRight
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

import Sidebar    from '../../components/Sidebar';
import StatCard   from '../../components/StatCard';
import DemoBadge  from '../../components/DemoBadge';
import { useApp } from '../../hooks/useApp';
import { formatCurrency, formatDate } from '../../data/mockData';
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
  const { getTotals, getRecentPayments, getMonthlyChartData, getCourseChartData } = useApp();
  const navigate   = useNavigate();
  const totals     = getTotals();
  const recent     = getRecentPayments(7);
  const monthlyData = getMonthlyChartData();
  const courseData  = getCourseChartData();

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

      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Top bar */}
        <div className="topbar">
          <div className="lg:pl-0 pl-12 flex flex-col min-w-0">
            <h1 className="text-xl lg:text-2xl font-black text-navy-900 tracking-tight">Overview</h1>
            <p className="text-xs sm:text-sm font-medium text-silver-500 mt-0.5">Welcome back, Admin 👋</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <DemoBadge />
            <button className="relative p-2.5 rounded-xl hover:bg-silver-100 transition-all duration-300 text-silver-600 hover:text-accent-600">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full animate-pulse" />
            </button>
            <div className="w-9 h-9 bg-gradient-accent rounded-xl flex items-center justify-center shadow-glow cursor-pointer hover:scale-105 transition-transform">
              <span className="text-white text-sm font-bold">A</span>
            </div>
          </div>
        </div>

        <div className="page-content space-y-5">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {CARDS.map((c) => (
              <StatCard key={c.title} {...c} />
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 card animate-fade-in">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-navy-950">Fee Collection Trend</h2>
                  <p className="text-xs text-silver-500 mt-0.5">Last 6 months — collected vs monthly target</p>
                </div>
              </div>
              {monthlyData.length === 0 ? (
                <div className="h-[220px] flex items-center justify-center text-silver-400 text-sm">No payment data yet.</div>
              ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#84cc16" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#84cc16" stopOpacity={0}    />
                    </linearGradient>
                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `₹${v / 1000}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                  <Area type="monotone" dataKey="target"    name="Monthly Target" stroke="#6366f1" fill="url(#colorTarget)"    strokeWidth={2} strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="collected" name="Collected"       stroke="#84cc16" fill="url(#colorCollected)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
              )}
            </div>

            {/* Pie chart */}
            <div className="card animate-fade-in">
              <h2 className="font-bold text-navy-950 mb-1">Students by Course</h2>
              <p className="text-xs text-silver-500 mb-4">Distribution across batches</p>
              {courseData.length === 0 ? (
                <div className="h-[170px] flex items-center justify-center text-silver-400 text-sm">No students yet.</div>
              ) : (
              <>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={courseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {courseData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name, props) => [`${props.payload.count} students (${val}%)`, props.payload.name]}
                    contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e5e7eb' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {courseData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs text-navy-800">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="truncate">{d.name}</span>
                    <span className="ml-auto font-bold text-silver-500">{d.count}</span>
                  </div>
                ))}
              </div>
              </>
              )}
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
