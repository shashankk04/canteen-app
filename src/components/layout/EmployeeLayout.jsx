import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Avatar, IconButton, Tooltip, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer, AppBar, Toolbar, Typography, Box, Divider
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard, Person, Restaurant, AccountBalanceWallet, Logout, Close
} from '@mui/icons-material';
import { useState } from 'react';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/employee' },
  { text: 'Profile', icon: <Person />, path: '/employee/profile' },
  { text: 'Menu', icon: <Restaurant />, path: '/employee/menu' },
  { text: 'Passbook', icon: <AccountBalanceWallet />, path: '/employee/passbook' },
];

export default function EmployeeLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <div className="h-full flex flex-col bg-[#111827]/90 border-r border-[#334155]/60 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#334155]/60">
        <div className="flex items-center gap-2">
          <Restaurant className="text-blue-400" />
          <span className="text-xl font-bold text-slate-100 tracking-tight">Canteen</span>
        </div>
        <IconButton className="lg:hidden" onClick={() => setMobileOpen(false)}>
          <Close className="text-slate-400 lg:hidden" />
        </IconButton>
      </div>
      <nav className="flex flex-col gap-1 mt-6 px-2">
        {menuItems.map(item => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => { navigate(item.path); setMobileOpen(false); }}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl font-medium text-base transition-all duration-200 relative ${location.pathname === item.path ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg before:content-[""] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-blue-400 before:rounded-l-xl' : 'text-slate-300 hover:bg-[#1e293b] hover:text-white'}`}
            style={{ marginBottom: 4 }}
          >
            {item.icon}
            {item.text}
          </ListItemButton>
        ))}
      </nav>
      <div className="mt-auto px-4 py-6">
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-[#1e293b] text-slate-400 hover:bg-red-500 hover:text-white transition-all font-medium"
        >
          <Logout fontSize="small" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      {/* Sidebar */}
      <aside className={`fixed z-30 inset-y-0 left-0 w-64 bg-[#111827]/90 border-r border-[#334155]/60 shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {drawer}
      </aside>
      {/* Overlay for mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={handleDrawerToggle} />
      )}
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#111827]/80 backdrop-blur-2xl border-b border-[#334155]/60 shadow-md w-full">
          <div className="flex items-center gap-3">
            <IconButton className="lg:hidden" onClick={handleDrawerToggle}>
              <MenuIcon className="text-slate-300" />
            </IconButton>
            <span className="text-lg font-bold text-slate-100 tracking-tight hidden md:inline">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Tooltip title={user?.name || ''}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48, fontWeight: 700, border: '2px solid #60a5fa', boxShadow: '0 2px 8px rgba(96,165,250,0.15)' }}>
                {user?.name?.[0]?.toUpperCase()}
              </Avatar>
            </Tooltip>
          </div>
        </header>
        <main className="flex-1 px-4 md:px-8 py-8 max-w-7xl w-full mx-auto lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 