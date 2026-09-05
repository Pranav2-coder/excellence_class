import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useApp } from './context/AppContext';

import Landing from './pages/Landing';
import AdminLogin from './pages/AdminLogin';
import StudentLogin from './pages/StudentLogin';

import AdminDashboard from './pages/admin/Dashboard';
import StudentsPage from './pages/admin/Students';
import StudentDetail from './pages/admin/StudentDetail';
import PaymentsPage from './pages/admin/Payments';
import SettingsPage from './pages/admin/Settings';
import StudentDashboard from './pages/student/Dashboard';

function RouteLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-navy-950">
        <svg className="animate-spin h-8 w-8 text-accent-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-sm font-medium text-silver-500">Loading...</p>
      </div>
    </div>
  );
}

function StartupRedirect() {
  const { adminAuth, authLoading, setActivePwaType } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith('/admin');
    const href = isAdminRoute ? '/admin-manifest.json' : '/student-manifest.json';
    const pwaType = isAdminRoute ? 'admin' : 'student';

    document.querySelectorAll('link[rel="manifest"]').forEach((link) => link.remove());

    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = href;
    document.head.appendChild(manifestLink);
    setActivePwaType(pwaType);
  }, [location.pathname, setActivePwaType]);

  useEffect(() => {
    if (authLoading) return;

    if (adminAuth && (location.pathname === '/' || location.pathname === '/admin/login')) {
      navigate('/admin', { replace: true });
      return;
    }

    if (!adminAuth && location.pathname === '/admin') {
      navigate('/admin/login', { replace: true });
    }
  }, [adminAuth, authLoading, location.pathname, navigate]);

  return null;
}

function AdminRoute({ children }) {
  const { adminAuth, authLoading, hasSupabaseSession } = useApp();

  if (authLoading) return <RouteLoading />;
  if (hasSupabaseSession && !adminAuth) return <Navigate to="/" replace />;
  return adminAuth ? children : <Navigate to="/admin/login" replace />;
}

function StudentRoute({ children }) {
  const { studentAuth } = useApp();
  return studentAuth ? children : <Navigate to="/student/login" replace />;
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            background: '#0f172a',
            color: '#ffffff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#ffffff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
        }}
      />

      <StartupRedirect />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/student/login" element={<StudentLogin />} />

        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/students" element={<AdminRoute><StudentsPage /></AdminRoute>} />
        <Route path="/admin/students/:id" element={<AdminRoute><StudentDetail /></AdminRoute>} />
        <Route path="/admin/payments" element={<AdminRoute><PaymentsPage /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />

        <Route path="/student/dashboard" element={<StudentRoute><StudentDashboard /></StudentRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
