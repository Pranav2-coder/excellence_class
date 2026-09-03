import { createContext, useContext, useState, useEffect } from 'react';
import { generatePaymentId, generateStudentId } from '../data/mockData';
import { supabase } from '../lib/supabase';


const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Auth state ──────────────────────────────────────────────
  const [adminAuth, setAdminAuth] = useState(false);
  const [studentAuth, setStudentAuth] = useState(null); // { id, name }

  // ── Data state ──────────────────────────────────────────────
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Restore Supabase Auth session on page load, and listen for changes
  useEffect(() => {
    // Get current session (handles page refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Verify this is actually the admin before trusting the session
        supabase
          .from('admin_profiles')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle()
          .then(({ data }) => {
            if (data) setAdminAuth(true);
          });
      }
    });

    // Listen for sign-in / sign-out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setAdminAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: studentsData, error: sErr } = await supabase.from('students').select('*');
    const { data: paymentsData, error: pErr } = await supabase.from('payments').select('*');
    
    if (sErr || pErr) {
      console.error('Error fetching data:', sErr || pErr);
      setLoading(false);
      return;
    }

    const studentsWithPayments = studentsData.map(s => ({
      id: s.id,
      name: s.name,
      mobile: s.mobile,
      course: s.course,
      yearlyFee: Number(s.yearly_fee),
      password: s.password,
      joinDate: s.join_date,
      payments: paymentsData
        .filter(p => p.student_id === s.id)
        .map(p => ({
          id: p.id,
          amount: Number(p.amount),
          date: p.date,
          mode: p.mode,
          note: p.note
        }))
    }));

    setStudents(studentsWithPayments);
    setLoading(false);
  };

  // ── Admin Actions ───────────────────────────────────────────
  const loginAdmin = () => setAdminAuth(true);
  const logoutAdmin = async () => {
    await supabase.auth.signOut();
    setAdminAuth(false);
    // Clear convenience cache but never store passwords
    localStorage.removeItem('admin_email_cache');
  };

  const loginStudent = (studentId, password) => {
    const searchId = studentId.trim().toUpperCase();
    const found = students.find(
      (s) => s.id.toUpperCase() === searchId && s.password === password
    );
    if (found) {
      setStudentAuth({ id: found.id, name: found.name });
      return true;
    }
    return false;
  };
  const logoutStudent = () => setStudentAuth(null);

  // Add a new student
  const addStudent = async ({ id, name, mobile, course, yearlyFee, password }) => {
    const newStudent = {
      id:        id || generateStudentId(students),
      name,
      mobile,
      course,
      yearlyFee: Number(yearlyFee),
      password:  password || 'pass123',
      joinDate:  new Date().toISOString().split('T')[0],
      payments:  [],
    };

    const { error } = await supabase.from('students').insert([{
      id: newStudent.id,
      name: newStudent.name,
      mobile: newStudent.mobile,
      course: newStudent.course,
      yearly_fee: newStudent.yearlyFee,
      password: newStudent.password,
      join_date: newStudent.joinDate,
    }]);

    if (error) {
      console.error(error);
      throw error;
    }

    setStudents((prev) => [...prev, newStudent]);
    return newStudent;
  };

  // Add a payment to a student
  const addPayment = async (studentId, { amount, date, mode, note }) => {
    const newPayment = {
      id:     generatePaymentId(),
      amount: Number(amount),
      date,
      mode,
      note:   note || '',
    };

    const { error } = await supabase.from('payments').insert([{
      id: newPayment.id,
      student_id: studentId,
      amount: newPayment.amount,
      date: newPayment.date,
      mode: newPayment.mode,
      note: newPayment.note,
    }]);

    if (error) {
      console.error(error);
      throw error;
    }

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          payments: [...s.payments, newPayment],
        };
      })
    );
  };

  // Delete a student
  const deleteStudent = async (studentId) => {
    // 1. Delete associated payments first (prevents Foreign Key errors if ON DELETE CASCADE is missing)
    const { error: paymentsError } = await supabase.from('payments').delete().eq('student_id', studentId);
    if (paymentsError) {
      console.error(paymentsError);
      throw paymentsError;
    }

    // 2. Delete the student
    const { error: studentError } = await supabase.from('students').delete().eq('id', studentId);
    if (studentError) {
      console.error(studentError);
      throw studentError;
    }
    
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  // ── Derived helpers ─────────────────────────────────────────
  const getStudent = (id) => students.find((s) => s.id === id);

  const getTotals = () => {
    const totalFees     = students.reduce((s, st) => s + st.yearlyFee, 0);
    const totalCollected = students.reduce(
      (s, st) => s + st.payments.reduce((a, p) => a + p.amount, 0),
      0
    );
    return {
      totalStudents:  students.length,
      totalFees,
      totalCollected,
      totalPending:   totalFees - totalCollected,
    };
  };

  const getRecentPayments = (limit = 8) => {
    const all = [];
    students.forEach((s) =>
      s.payments.forEach((p) =>
        all.push({ ...p, studentName: s.name, studentId: s.id, course: s.course })
      )
    );
    return all.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);
  };

  // ── Chart data computed from real payments ─────────────────
  const getMonthlyChartData = () => {
    // Build last-6-months labels
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        label: d.toLocaleString('en-IN', { month: 'short' }),
        collected: 0,
        target: 0,
      });
    }

    // Sum collected per month from real payments
    students.forEach((s) => {
      // Monthly target = yearly_fee / 12
      const monthlyTarget = Math.round(s.yearlyFee / 12);
      months.forEach((m) => { m.target += monthlyTarget; });

      s.payments.forEach((p) => {
        const key = p.date.slice(0, 7); // 'YYYY-MM'
        const slot = months.find((m) => m.key === key);
        if (slot) slot.collected += p.amount;
      });
    });

    return months.map(({ label, collected, target }) => ({ month: label, collected, target }));
  };

  const getCourseChartData = () => {
    if (!students.length) return [];
    const counts = {};
    students.forEach((s) => {
      // Shorten long course names for the legend
      const short = s.course
        .replace('Foundation', 'Found.')
        .replace('Preparation', 'Prep.')
        .replace('Training', 'Train.')
        .replace('Class ', 'Cls ');
      counts[short] = (counts[short] || 0) + 1;
    });
    const total = students.length;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        name,
        value: Math.round((count / total) * 100),
        count,
      }));
  };

  const value = {
    // auth
    adminAuth, loginAdmin, logoutAdmin,
    studentAuth, loginStudent, logoutStudent,
    // data
    students,
    loading,
    addStudent,
    addPayment,
    deleteStudent,
    getStudent,
    getTotals,
    getRecentPayments,
    getMonthlyChartData,
    getCourseChartData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
