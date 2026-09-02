import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useApp } from './context/AppContext';

import Landing       from './pages/Landing';
import AdminLogin    from './pages/AdminLogin';
import StudentLogin  from './pages/StudentLogin';

import AdminDashboard   from './pages/admin/Dashboard';
import StudentsPage     from './pages/admin/Students';
import StudentDetail    from './pages/admin/StudentDetail';
import PaymentsPage     from './pages/admin/Payments';
import SettingsPage     from './pages/admin/Settings';
import StudentDashboard from './pages/student/Dashboard';

// ── Route guards ──────────────────────────────────────────────
function AdminRoute({ children }) {
  const { adminAuth } = useApp();
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
          error:   { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
        }}
      />

      <Routes>
        {/* Public */}
        <Route path="/"               element={<Landing />} />
        <Route path="/admin"          element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login"    element={<AdminLogin />} />
        <Route path="/student/login"  element={<StudentLogin />} />

        {/* Admin (protected) */}
        <Route path="/admin/dashboard"         element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/students"          element={<AdminRoute><StudentsPage /></AdminRoute>} />
        <Route path="/admin/students/:id"      element={<AdminRoute><StudentDetail /></AdminRoute>} />
        <Route path="/admin/payments"          element={<AdminRoute><PaymentsPage /></AdminRoute>} />
        <Route path="/admin/settings"          element={<AdminRoute><SettingsPage /></AdminRoute>} />

        {/* Student (protected) */}
        <Route path="/student/dashboard"       element={<StudentRoute><StudentDashboard /></StudentRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
