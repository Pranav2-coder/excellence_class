import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, CreditCard, Settings,
  LogOut, GraduationCap, ChevronRight, X, Menu
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/admin/students',  label: 'Students',   icon: Users           },
  { to: '/admin/payments',  label: 'Payments',   icon: CreditCard      },
  { to: '/admin/settings',  label: 'Settings',   icon: Settings        },
];

function SidebarContent({ onClose }) {
  const { logoutAdmin } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full bg-navy-950 border-r border-white/5 shadow-2xl">
      {/* Logo */}
      <div className="px-6 py-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-tr from-lime-400 to-lime-600 rounded-xl flex items-center justify-center shadow-lg shadow-lime-500/30 flex-shrink-0">
          <GraduationCap size={20} className="text-white" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-[15px] leading-tight tracking-tight">Excellence</p>
          <p className="text-lime-500 text-[11px] font-semibold tracking-wider uppercase mt-0.5">Admin Panel</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-silver-400 hover:text-white lg:hidden p-1 bg-white/5 rounded-lg transition-colors">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="px-5 mb-4">
        <p className="text-silver-500 text-[10px] font-bold uppercase tracking-widest px-2">Main Menu</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 overflow-hidden ${
                isActive 
                  ? 'bg-lime-500/10 text-white font-semibold' 
                  : 'text-silver-400 hover:text-white hover:bg-white/5 font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-lime-500 rounded-r-full shadow-[0_0_10px_rgba(132,204,22,0.5)]"></div>
                )}
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-lime-500' : 'text-silver-400 group-hover:text-silver-300'} />
                <span className="flex-1 text-sm">{label}</span>
                <ChevronRight size={14} strokeWidth={2.5} className={`transition-transform duration-200 ${isActive ? 'text-lime-500 opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0'}`} />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-silver-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all font-semibold text-sm group"
        >
          <LogOut size={18} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2.5 bg-navy-950 rounded-xl text-white shadow-lg border border-white/10 transition-transform hover:scale-105"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside className={`
        lg:hidden fixed left-0 top-0 h-full z-50 w-[260px]
        transform transition-transform duration-300 ease-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] flex-shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  );
}
