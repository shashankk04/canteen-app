import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar, IconButton, Tooltip, Badge } from '@mui/material';
import {
  Dashboard, People, Inventory, Receipt,
  Menu as MenuIcon, Logout, Fastfood, Close, Notifications
} from '@mui/icons-material';

const navLinks = [
  { label: 'Dashboard', icon: <Dashboard />, path: '/admin' },
  { label: 'Employees', icon: <People />, path: '/admin/employees' },
  { label: 'Items', icon: <Inventory />, path: '/admin/items' },
  { label: 'Transactions', icon: <Receipt />, path: '/admin/transactions' },
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      {/* Sidebar */}
      <aside className={`fixed z-30 inset-y-0 left-0 w-64 bg-[#111827]/90 border-r border-[#334155]/60 shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155]/60">
          <div className="flex items-center gap-2">
            <Fastfood className="text-blue-400" />
            <span className="text-xl font-bold text-slate-100 tracking-tight">Canteen</span>
          </div>
          <IconButton className="lg:invisible" onClick={() => setSidebarOpen(false)}>
            <Close className="text-slate-400 lg:invisible"  />
          </IconButton>
        </div>
        <nav className="flex flex-col gap-1 mt-6 px-2">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base transition-all duration-200 ${location.pathname === link.path ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-slate-300 hover:bg-[#1e293b] hover:text-white'}`}
              onClick={() => setSidebarOpen(false)}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto px-4 py-6">
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-[#1e293b] text-slate-400 hover:bg-red-500 hover:text-white transition-all"
          >
            <Logout fontSize="small" /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content wrapper (Topbar + Page content) */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar - full width */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#111827]/80 backdrop-blur-xl border-b border-[#334155]/60 shadow-md w-full">
          <div className="flex items-center gap-3">
            <IconButton className="lg:invisible" onClick={() => setSidebarOpen(true)}>
              <MenuIcon className="text-slate-300 lg:invisible" />
            </IconButton>
            <span className="text-lg font-bold text-slate-100 tracking-tight hidden md:inline">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Tooltip title={user?.name || ''}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontWeight: 700 }}>
                {user?.name?.[0]?.toUpperCase()}
              </Avatar>
            </Tooltip>
          </div>
        </header>

        {/* Page content area - shifted on lg screens */}
        <main className="flex-1 px-4 md:px-8 py-8 max-w-7xl w-full mx-auto lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
