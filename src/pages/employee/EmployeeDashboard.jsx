import React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Typography, Box, Card, CardContent, Grid, CircularProgress, Button, Chip, Alert
} from '@mui/material';
import {
  AccountBalanceWallet, Fastfood, Receipt, Person
} from '@mui/icons-material';
import api from '../../utils/api';

const quickLinks = [
  { label: 'Menu', icon: <Fastfood />, path: '/employee/menu', color: 'from-yellow-500 to-yellow-700', desc: 'See today’s available items' },
  { label: 'Passbook', icon: <AccountBalanceWallet />, path: '/employee/passbook', color: 'from-green-500 to-green-700', desc: 'View your transaction history' },
  { label: 'Profile', icon: <Person />, path: '/employee/profile', color: 'from-blue-500 to-blue-700', desc: 'View and edit your profile' },
];

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('EmployeeDashboard mounted, user:', user);
    fetchEmployeeMetrics();
    fetchRecentTransactions();
  }, []);

  const fetchEmployeeMetrics = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching employee metrics...');
      const res = await api.get('/dashboard/employee-metrics');
      console.log('Employee metrics response:', res.data);
      setMetrics(res.data);
    } catch (e) {
      console.error('Error fetching employee metrics:', e);
      setError(e.response?.data?.message || 'Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTransactions = async () => {
    setRecentLoading(true);
    setError('');
    try {
      console.log('Fetching recent transactions...');
      const res = await api.get('/transactions/me');
      console.log('Recent transactions response:', res.data);
      setRecent(res.data.slice(0, 3));
    } catch (e) {
      console.error('Error fetching recent transactions:', e);
      setError(e.response?.data?.message || 'Failed to fetch recent transactions');
      setRecent([]);
    } finally {
      setRecentLoading(false);
    }
  };

  return (
    <Box className="max-w-4xl w-full mx-auto px-6 md:px-12">
      <Box className="mb-8">
        <Typography variant="h3" className="font-extrabold text-slate-100 mb-2 tracking-tight" sx={{ letterSpacing: '-0.03em', fontSize: '1.7rem' }}>
          Welcome, {user?.name}! <span className="text-2xl">👋</span>
        </Typography>
        <Typography variant="body1" className="text-slate-400 mb-6" sx={{ fontSize: '1rem' }}>
          Here’s your canteen dashboard
        </Typography>
      </Box>
      {error && (
        <Alert 
          severity="error" 
          className="mb-4"
          action={
            <Button color="inherit" size="small" onClick={() => {
              setError('');
              fetchEmployeeMetrics();
              fetchRecentTransactions();
            }}>
              Retry
            </Button>
          }
        >
          <div>
            <strong>Error:</strong> {error}
            <br />
            <small>Please check your connection and try refreshing the page.</small>
          </div>
        </Alert>
      )}
      <Grid container spacing={3} className="mb-8">
        <Grid item xs={12} md={6} lg={4}>
          <Card className="rounded-xl shadow-xl bg-gradient-to-br from-green-500 to-green-700 bg-opacity-80 backdrop-blur-xl border border-[#334155]/40 metric-card hover:scale-[1.03] hover:shadow-2xl transition-transform">
            <CardContent className="flex flex-col items-center py-6">
              <AccountBalanceWallet fontSize="large" className="mb-2 text-white" />
              <Typography variant="h3" className="font-extrabold text-white mb-1" sx={{ fontSize: '1.3rem', fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : `₹${metrics?.balance ?? '--'}`}
              </Typography>
              <Typography variant="body1" className="text-slate-200 opacity-80">
                Current Balance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card className="rounded-xl shadow-xl bg-gradient-to-br from-red-500 to-red-700 bg-opacity-80 backdrop-blur-xl border border-[#334155]/40 metric-card hover:scale-[1.03] hover:shadow-2xl transition-transform">
            <CardContent className="flex flex-col items-center py-6">
              <Receipt fontSize="large" className="mb-2 text-white" />
              <Typography variant="h3" className="font-extrabold text-white mb-1" sx={{ fontSize: '1.3rem', fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : `₹${metrics?.totalSpent ?? '--'}`}
              </Typography>
              <Typography variant="body1" className="text-slate-200 opacity-80">
                Total Spent
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card className="rounded-xl shadow-xl bg-gradient-to-br from-blue-500 to-blue-700 bg-opacity-80 backdrop-blur-xl border border-[#334155]/40 metric-card hover:scale-[1.03] hover:shadow-2xl transition-transform">
            <CardContent className="flex flex-col items-center py-6">
              <Fastfood fontSize="large" className="mb-2 text-white" />
              <Typography variant="h3" className="font-extrabold text-white mb-1" sx={{ fontSize: '1.3rem', fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : metrics?.purchases ?? '--'}
              </Typography>
              <Typography variant="body1" className="text-slate-200 opacity-80">
                Purchases
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <Card className="rounded-xl shadow-xl bg-gradient-to-br from-slate-800 to-slate-900 bg-opacity-80 backdrop-blur-xl border border-[#334155]/40 h-full">
            <CardContent>
              <Typography variant="h6" className="font-bold text-slate-100 mb-2" sx={{ fontSize: '1rem' }}>Recent Activity</Typography>
              {recentLoading ? (
                <CircularProgress size={20} />
              ) : recent.length === 0 ? (
                <Typography className="text-slate-400">No recent transactions.</Typography>
              ) : (
                <Box className="flex flex-col gap-2">
                  {recent.map((tx, idx) => (
                    <Box key={tx._id} className="flex items-center gap-4 p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 transition relative" style={{ borderBottom: idx !== recent.length - 1 ? '1px solid #33415544' : 'none' }}>
                      <Chip label={tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} color={tx.type === 'credit' ? 'success' : 'error'} size="small" />
                      <Typography className="text-slate-100 font-bold" sx={{ fontSize: '1rem' }}>
                        ₹{tx.amount}
                      </Typography>
                      <Typography className="text-slate-300 text-base flex-1" sx={{ fontWeight: 500 }}>
                        {tx.description}
                      </Typography>
                      <Typography className="text-slate-400 text-xs" sx={{ fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>
                        {new Date(tx.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Typography variant="h5" className="text-slate-100 font-bold mb-4" sx={{ fontFamily: 'Inter, Roboto, Arial, sans-serif', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.01em' }}>Quick Links</Typography>
      <div style={{ marginBottom: '1rem' }}></div>
      <Grid container spacing={3}>
        {quickLinks.map(link => (
          <Grid item xs={12} sm={6} md={4} key={link.label}>
            <Card
              className={`rounded-xl shadow-lg bg-gradient-to-br ${link.color} bg-opacity-80 backdrop-blur-xl border border-[#334155]/40 cursor-pointer hover:scale-[1.04] hover:shadow-2xl transition-transform`}
              sx={{ minHeight: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 2, py: 2, boxShadow: '0 2px 8px 0 rgba(31,38,135,0.12)', borderRadius: 3 }}
              onClick={() => link.path && (window.location.href = link.path)}
            >
              <Box className="flex items-center justify-center w-10 h-10 rounded-lg bg-black/20 mb-2">
                {link.icon}
              </Box>
              <Typography variant="h6" className="font-bold text-slate-100 mb-1" sx={{ fontFamily: 'Inter, Roboto, Arial, sans-serif', fontWeight: 700, fontSize: '1rem' }}>
                {link.label}
              </Typography>
              <Typography variant="body2" className="text-slate-200 opacity-80 text-center" sx={{ fontFamily: 'Inter, Roboto, Arial, sans-serif', fontWeight: 400 }}>
                {link.desc}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EmployeeDashboard; 