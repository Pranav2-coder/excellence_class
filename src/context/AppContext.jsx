import { createContext, useContext, useState, useEffect } from 'react';
import { generatePaymentId, generateStudentId } from '../data/mockData';
import { supabase } from '../lib/supabase';

const AppContext = createContext(null);

const isStandaloneDisplay = () =>
  window.matchMedia?.('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

const getPwaTypeForPath = (pathname = window.location.pathname) =>
  pathname.startsWith('/admin') ? 'admin' : 'student';

export function AppProvider({ children }) {
  const [adminAuth, setAdminAuth] = useState(false);
  const [studentAuth, setStudentAuth] = useState(null);
  const [hasSupabaseSession, setHasSupabaseSession] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [installPrompt, setInstallPrompt] = useState(null);
  const [installPromptType, setInstallPromptType] = useState(null);
  const [isInstalled, setIsInstalled] = useState(isStandaloneDisplay);
  const [activePwaType, setActivePwaType] = useState(getPwaTypeForPath);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      if (!isStandaloneDisplay()) {
        setInstallPrompt(event);
        setInstallPromptType(getPwaTypeForPath());
      }
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setInstallPromptType(null);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt || isInstalled) return false;

    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);
    setInstallPromptType(null);
    return choice?.outcome === 'accepted';
  };

  const verifyAdminSession = async (session) => {
    if (!session?.user) {
      setHasSupabaseSession(false);
      setAdminAuth(false);
      return false;
    }

    setHasSupabaseSession(true);

    const { data, error } = await supabase
      .from('admin_profiles')
      .select('id, role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (error) {
      console.error('Error checking admin profile:', error);
      setAdminAuth(false);
      return false;
    }

    const isAdmin = Boolean(data);
    setAdminAuth(isAdmin);
    return isAdmin;
  };

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      await verifyAdminSession(session);
      if (!cancelled) setAuthLoading(false);
    };

    restoreSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setAuthLoading(true);
      await verifyAdminSession(session);
      setAuthLoading(false);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
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

    const studentsWithPayments = studentsData.map((s) => ({
      id: s.id,
      name: s.name,
      mobile: s.mobile,
      course: s.course,
      yearlyFee: Number(s.yearly_fee),
      password: s.password,
      joinDate: s.join_date,
      payments: paymentsData
        .filter((p) => p.student_id === s.id)
        .map((p) => ({
          id: p.id,
          amount: Number(p.amount),
          date: p.date,
          mode: p.mode,
          note: p.note,
        })),
    }));

    setStudents(studentsWithPayments);
    setLoading(false);
  };

  const loginAdmin = () => setAdminAuth(true);

  const logoutAdmin = async () => {
    await supabase.auth.signOut();
    setAdminAuth(false);
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

  const addStudent = async ({ id, name, mobile, course, yearlyFee, password }) => {
    const newStudent = {
      id: id || generateStudentId(students),
      name,
      mobile,
      course,
      yearlyFee: Number(yearlyFee),
      password: password || 'pass123',
      joinDate: new Date().toISOString().split('T')[0],
      payments: [],
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

  const addPayment = async (studentId, { amount, date, mode, note }) => {
    const newPayment = {
      id: generatePaymentId(),
      amount: Number(amount),
      date,
      mode,
      note: note || '',
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

  const deleteStudent = async (studentId) => {
    const { error: paymentsError } = await supabase.from('payments').delete().eq('student_id', studentId);
    if (paymentsError) {
      console.error(paymentsError);
      throw paymentsError;
    }

    const { error: studentError } = await supabase.from('students').delete().eq('id', studentId);
    if (studentError) {
      console.error(studentError);
      throw studentError;
    }

    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  const getStudent = (id) => students.find((s) => s.id === id);

  const getTotals = () => {
    const totalFees = students.reduce((s, st) => s + st.yearlyFee, 0);
    const totalCollected = students.reduce(
      (s, st) => s + st.payments.reduce((a, p) => a + p.amount, 0),
      0
    );

    return {
      totalStudents: students.length,
      totalFees,
      totalCollected,
      totalPending: totalFees - totalCollected,
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

  const getMonthlyChartData = () => {
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

    students.forEach((s) => {
      const monthlyTarget = Math.round(s.yearlyFee / 12);
      months.forEach((m) => { m.target += monthlyTarget; });

      s.payments.forEach((p) => {
        const key = p.date.slice(0, 7);
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
    adminAuth,
    hasSupabaseSession,
    authLoading,
    loginAdmin,
    logoutAdmin,
    studentAuth,
    loginStudent,
    logoutStudent,
    activePwaType,
    setActivePwaType,
    canInstallStudentApp: Boolean(installPrompt) && installPromptType === 'student' && activePwaType === 'student' && !isInstalled,
    canInstallAdminApp: Boolean(installPrompt) && installPromptType === 'admin' && activePwaType === 'admin' && !isInstalled,
    installApp,
    isInstalled,
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
