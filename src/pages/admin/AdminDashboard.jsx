import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Typography, Box, Card, CardContent, CircularProgress, Grid, Button
} from '@mui/material';
import {
  Dashboard, People, Inventory, Receipt, TrendingUp, TrendingDown, AccountBalance, Menu as MenuIcon
} from '@mui/icons-material';
import api from '../../utils/api';

const metricCards = [
  { label: 'Total Employees', icon: <People fontSize="large" />, color: 'from-blue-500 to-blue-700', key: 'employeeCount' },
  { label: 'Master Items', icon: <Inventory fontSize="large" />, color: 'from-green-500 to-green-700', key: 'totalItems' },
  { label: "Today's Items", icon: <MenuIcon fontSize="large" />, color: 'from-yellow-500 to-yellow-700', key: 'todayItems' },
  { label: 'Total Credited', icon: <TrendingUp fontSize="large" />, color: 'from-green-400 to-green-600', key: 'totalCredited', isMoney: true },
  { label: 'Total Debited', icon: <TrendingDown fontSize="large" />, color: 'from-red-400 to-red-600', key: 'totalDebited', isMoney: true },
  { label: 'Transactions', icon: <Receipt fontSize="large" />, color: 'from-purple-500 to-purple-700', key: 'transactions' },
];

const quickActions = [
  { label: 'Manage Employees', icon: <People />, path: '/admin/employees', color: 'from-blue-500 to-blue-700', desc: 'Add, edit, and manage employee accounts' },
  { label: 'Manage Items', icon: <Inventory />, path: '/admin/items', color: 'from-green-500 to-green-700', desc: 'Update menu and set daily items' },
  { label: 'View Transactions', icon: <Receipt />, path: '/admin/transactions', color: 'from-purple-500 to-purple-700', desc: 'Monitor all financial transactions' },
  { label: 'System Overview', icon: <AccountBalance />, path: '#', color: 'from-orange-500 to-orange-700', desc: 'View detailed analytics and reports' },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      const response = await api.get('/dashboard/metrics');
      setMetrics({
        ...response.data,
        transactions: (response.data.creditTransactions || 0) + (response.data.debitTransactions || 0),
      });
    } catch (error) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Box className="mb-8">
        <Typography variant="h3" className="font-extrabold text-slate-100 mb-2 tracking-tight" sx={{ letterSpacing: '-0.03em', fontSize: '1.7rem' }}>
          Welcome back, {user?.name}! <span className="text-2xl">👋</span>
        </Typography>
        <Typography variant="body1" className="text-slate-400 mb-6" sx={{ fontSize: '1rem' }}>
          Here's what's happening with your canteen today
        </Typography>
      </Box>
      {/* Metrics Grid */}
      <Grid container spacing={3} className="mb-8">
        {loading ? (
          <Grid item xs={12} className="flex justify-center">
            <CircularProgress />
          </Grid>
        ) : metricCards.map(card => (
          <Grid item xs={12} sm={6} md={4} key={card.label}>
            <Card
              className={`rounded-xl shadow-xl bg-gradient-to-br ${card.color} bg-opacity-80 backdrop-blur-xl border border-[#334155]/40 metric-card hover:scale-[1.03] hover:shadow-2xl transition-transform`}
              sx={{ minHeight: 110, display: 'flex', alignItems: 'center', px: 2, py: 1.5, boxShadow: '0 4px 16px 0 rgba(31,38,135,0.18)', borderRadius: 3 }}
            >
              <Box className="flex items-center gap-4 w-full">
                <Box className="flex items-center justify-center w-12 h-12 rounded-xl bg-black/20 shadow-lg">
                  {card.icon}
                </Box>
                <Box className="flex-1">
                  <Typography variant="h3" className="font-extrabold text-slate-100" sx={{ fontSize: '1.3rem', fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>
                    {card.isMoney ? '₹' : ''}{metrics?.[card.key] ?? '--'}
                  </Typography>
                  <Typography variant="body2" className="text-slate-200 opacity-80">
                    {card.label}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Quick Actions */}
      <Typography variant="h5" className="text-slate-100 font-bold mb-4" sx={{ fontFamily: 'Inter, Roboto, Arial, sans-serif', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.01em' }}>Quick Actions</Typography>
      <div style={{ marginBottom: '1rem' }}></div>
      <Grid container spacing={3}>
        {quickActions.map(action => (
          <Grid item xs={12} sm={6} md={3} key={action.label}>
            <Card
              className={`rounded-xl shadow-lg bg-gradient-to-br ${action.color} bg-opacity-80 backdrop-blur-xl border border-[#334155]/40 cursor-pointer hover:scale-[1.04] hover:shadow-2xl transition-transform`}
              sx={{ minHeight: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 2, py: 2, boxShadow: '0 2px 8px 0 rgba(31,38,135,0.12)', borderRadius: 3 }}
              onClick={() => action.path !== '#' && navigate(action.path)}
            >
              <Box className="flex items-center justify-center w-10 h-10 rounded-lg bg-black/20 mb-2">
                {action.icon}
              </Box>
              <Typography variant="h6" className="font-bold text-slate-100 mb-1" sx={{ fontFamily: 'Inter, Roboto, Arial, sans-serif', fontWeight: 700, fontSize: '1rem' }}>
                {action.label}
              </Typography>
              <Typography variant="body2" className="text-slate-200 opacity-80 text-center" sx={{ fontFamily: 'Inter, Roboto, Arial, sans-serif', fontWeight: 400 }}>
                {action.desc}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </DashboardLayout>
  );
};

export default AdminDashboard; 