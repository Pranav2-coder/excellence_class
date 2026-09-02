import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Users, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

import Sidebar    from '../../components/Sidebar';
import Modal      from '../../components/Modal';
import DemoBadge  from '../../components/DemoBadge';
import ProgressBar from '../../components/ProgressBar';
import { useApp } from '../../context/AppContext';
import { formatCurrency, calcPaid, calcRemaining, COURSES } from '../../data/mockData';

function AddStudentModal({ isOpen, onClose }) {
  const { addStudent } = useApp();
  const [form, setForm] = useState({ id: '', name: '', mobile: '', course: COURSES[0], yearlyFee: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.id.trim())                e.id        = 'Student ID is required';
    if (!form.name.trim())              e.name      = 'Name is required';
    if (!/^\d{10}$/.test(form.mobile))  e.mobile    = '10-digit mobile number required';
    if (!form.yearlyFee || isNaN(form.yearlyFee) || Number(form.yearlyFee) <= 0)
                                         e.yearlyFee = 'Valid yearly fee required';
    if (!form.password.trim())          e.password  = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const student = await addStudent({ ...form, id: form.id.trim(), password: form.password.trim() });
      toast.success(`✅ Student ${student.name} added!`);
      setForm({ id: '', name: '', mobile: '', course: COURSES[0], yearlyFee: '', password: '' });
      setErrors({});
      onClose();
    } catch (err) {
      toast.error('Failed to add student to database.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Student">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Custom Student ID *</label>
          <input
            className={`input uppercase ${errors.id ? 'border-rose-500 focus:ring-rose-400' : ''}`}
            placeholder="e.g. C8001"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
          />
          {errors.id && <p className="text-rose-500 text-xs mt-1">{errors.id}</p>}
        </div>

        <div>
          <label className="label">Full Name *</label>
          <input
            className={`input ${errors.name ? 'border-rose-500 focus:ring-rose-400' : ''}`}
            placeholder="e.g. Rahul Sharma"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="label">Mobile Number *</label>
          <input
            className={`input ${errors.mobile ? 'border-rose-500 focus:ring-rose-400' : ''}`}
            placeholder="10-digit mobile"
            maxLength={10}
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })}
          />
          {errors.mobile && <p className="text-rose-500 text-xs mt-1">{errors.mobile}</p>}
        </div>

        <div>
          <label className="label">Course *</label>
          <select
            className="input"
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
          >
            {COURSES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Yearly Fee (₹) *</label>
          <input
            className={`input ${errors.yearlyFee ? 'border-rose-500 focus:ring-rose-400' : ''}`}
            placeholder="e.g. 48000"
            value={form.yearlyFee}
            onChange={(e) => setForm({ ...form, yearlyFee: e.target.value })}
          />
          {errors.yearlyFee && <p className="text-rose-500 text-xs mt-1">{errors.yearlyFee}</p>}
        </div>

        <div>
          <label className="label">Student Password *</label>
          <input
            className={`input ${errors.password ? 'border-rose-500 focus:ring-rose-400' : ''}`}
            placeholder="e.g. stu@123"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && <p className="text-rose-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <div className="p-3 bg-silver-200 rounded-xl text-xs text-silver-600">
          <strong>Note:</strong> Students will use this ID and password to log in to their portal.
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button type="submit" className="btn-primary flex-1 justify-center">Add Student</button>
        </div>
      </form>
    </Modal>
  );
}

export default function StudentsPage() {
  const { students } = useApp();
  const navigate = useNavigate();
  const [search,   setSearch]   = useState('');
  const [addOpen,  setAddOpen]  = useState(false);
  const [courseFilter, setCourseFilter] = useState('All');

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.mobile.includes(q);
    const matchCourse = courseFilter === 'All' || s.course === courseFilter;
    return matchSearch && matchCourse;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-silver-100">
      <Sidebar />
      <AddStudentModal isOpen={addOpen} onClose={() => setAddOpen(false)} />

      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Top bar */}
        <div className="topbar">
          <div className="lg:pl-0 pl-12 flex items-center gap-2 min-w-0">
            <Users size={22} className="text-accent-500 flex-shrink-0" />
            <h1 className="text-xl lg:text-2xl font-black text-navy-900 tracking-tight truncate">Students</h1>
            <span className="badge-info ml-1 flex-shrink-0">{students.length}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <DemoBadge />
            <button onClick={() => setAddOpen(true)} className="btn-primary">
              <Plus size={16} />
              <span className="hidden sm:inline">Add Student</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        <div className="page-content space-y-4">
          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-500" />
              <input
                className="input pl-10 bg-white"
                placeholder="Search by name, ID, or mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="input w-full sm:w-48 bg-white"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="All">All Courses</option>
              {COURSES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="card p-0 overflow-hidden animate-fade-in">
            <div className="table-wrapper border-0 rounded-2xl">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Mobile</th>
                    <th>Yearly Fee</th>
                    <th>Paid</th>
                    <th>Remaining</th>
                    <th>Progress</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-silver-400">
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((s) => {
                      const paid      = calcPaid(s);
                      const remaining = calcRemaining(s);
                      const pct       = Math.round((paid / s.yearlyFee) * 100);
                      return (
                        <tr key={s.id}>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-gradient-accent rounded-xl flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-sm font-bold">{s.name[0]}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-navy-950 text-sm">{s.name}</p>
                                <p className="text-xs text-silver-500 font-mono">{s.id}</p>
                              </div>
                            </div>
                          </td>
                          <td><span className="badge-info">{s.course}</span></td>
                          <td className="font-mono text-sm text-navy-800">{s.mobile}</td>
                          <td className="font-semibold text-navy-800">{formatCurrency(s.yearlyFee)}</td>
                          <td className="font-bold text-emerald-600">{formatCurrency(paid)}</td>
                          <td>
                            <span className={remaining > 0 ? 'font-bold text-amber-600' : 'font-bold text-emerald-600'}>
                              {remaining > 0 ? formatCurrency(remaining) : '✓ Cleared'}
                            </span>
                          </td>
                          <td className="min-w-[120px]">
                            <ProgressBar value={paid} max={s.yearlyFee} />
                            <p className="text-xs text-silver-500 mt-1 text-right">{pct}%</p>
                          </td>
                          <td>
                            <button
                              onClick={() => navigate(`/admin/students/${s.id}`)}
                              className="btn-ghost text-accent-500 hover:bg-accent-50"
                            >
                              <Eye size={15} />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })
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
