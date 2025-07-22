import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Typography, Box, Card, CardContent, TextField, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Alert
} from '@mui/material';
import api from '../../utils/api';

const EmployeeProfile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openPwd, setOpenPwd] = useState(false);
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  // Self-credit state
  const [openCredit, setOpenCredit] = useState(false);
  const [creditAmount, setCreditAmount] = useState('');
  const [creditLoading, setCreditLoading] = useState(false);
  const [creditError, setCreditError] = useState('');
  const [creditSuccess, setCreditSuccess] = useState('');
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Auto-hide success message after 2 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/employees/profile');
      setForm({ name: res.data.name, email: res.data.email });
      setBalance(res.data.balance);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      // Only send name
      const res = await api.put('/employees/profile', { name: form.name });
      setForm(f => ({ ...f, name: res.data.name }));
      setUser(u => ({ ...u, name: res.data.name }));
      setSuccess('Profile updated successfully!');
      setError('');
    } catch (e) {
      console.log('Profile update error:', e, e.response);
      if (e.response && e.response.status && e.response.status !== 200) {
        setError(e.response?.data?.message || 'Failed to update profile');
      } else {
        setError(''); // Clear error if no real error
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePwdChange = e => {
    setPwdForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handlePwdSave = async () => {
    setPwdSaving(true);
    setPwdError('');
    setPwdSuccess('');
    try {
      await api.put('/employees/profile/password', pwdForm);
      setOpenPwd(false);
      setPwdForm({ currentPassword: '', newPassword: '' });
      setPwdSuccess('Password changed successfully!');
    } catch (e) {
      setPwdError(e.response?.data?.message || 'Failed to change password');
    } finally {
      setPwdSaving(false);
    }
  };

  // Self-credit handler
  const handleCredit = async () => {
    setCreditLoading(true);
    setCreditError('');
    setCreditSuccess('');
    try {
      const amt = parseFloat(creditAmount);
      if (isNaN(amt) || amt <= 0) {
        setCreditError('Enter a valid amount');
        setCreditLoading(false);
        return;
      }
      const res = await api.post('/employees/self-credit', { amount: amt });
      setCreditSuccess(res.data.message);
      setBalance(res.data.balance);
      setCreditAmount('');
      fetchProfile();
    } catch (e) {
      setCreditError(e.response?.data?.message || 'Failed to add money');
    } finally {
      setCreditLoading(false);
    }
  };

  return (
    <Box>
      <Box className="mb-8">
        <Typography variant="h4" className="font-extrabold text-slate-100 mb-1 tracking-tight">My Profile</Typography>
        <Typography variant="body1" className="text-slate-400">View and update your profile information</Typography>
      </Box>
      {balance !== null && (
        <Alert severity="info" className="mb-4">Current Balance: <b>₹{balance}</b></Alert>
      )}
      {error && <Alert severity="error" className="mb-4">{error}</Alert>}
      {success && <Alert severity="success" className="mb-4">{success}</Alert>}
      <Card className="rounded-2xl shadow-xl bg-gradient-to-br from-blue-500 to-blue-700 bg-opacity-80 backdrop-blur-xl border border-[#334155]/40 max-w-xl mx-auto">
        <CardContent>
          {loading ? (
            <Box className="flex justify-center py-10">
              <CircularProgress />
            </Box>
          ) : (
            <form className="flex flex-col gap-6">
              <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="mb-2"
                InputProps={{ className: 'text-slate-100' }}
              />
              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                className="mb-2"
                InputProps={{ className: 'text-slate-100' }}
                disabled
              />
              <Box className="flex gap-4 mt-2">
                <Button
                  variant="contained"
                  className="bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg rounded-xl"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="outlined"
                  className="border-blue-400 text-blue-200"
                  onClick={() => setOpenPwd(true)}
                >
                  Change Password
                </Button>
                <Button
                  variant="outlined"
                  className="border-green-400 text-green-200"
                  onClick={() => setOpenCredit(true)}
                >
                  Add Money
                </Button>
              </Box>
            </form>
          )}
        </CardContent>
      </Card>
      {/* Add Money Dialog */}
      <Dialog open={openCredit} onClose={() => { setOpenCredit(false); setCreditError(''); setCreditSuccess(''); }} maxWidth="xs" fullWidth>
        <DialogTitle className="font-bold text-slate-100 bg-slate-900">Add Money</DialogTitle>
        <DialogContent className="bg-slate-800">
          {creditError && <Alert severity="error" className="mb-2">{creditError}</Alert>}
          {creditSuccess && <Alert severity="success" className="mb-2">{creditSuccess}</Alert>}
          <TextField
            margin="dense"
            label="Amount"
            name="amount"
            type="number"
            value={creditAmount}
            onChange={e => setCreditAmount(e.target.value)}
            fullWidth
            variant="outlined"
            className="mb-4"
            InputProps={{ className: 'text-slate-100' }}
          />
        </DialogContent>
        <DialogActions className="bg-slate-900">
          <Button onClick={() => setOpenCredit(false)} className="text-slate-300">Cancel</Button>
          <Button onClick={handleCredit} variant="contained" className="bg-gradient-to-br from-green-500 to-green-700 text-white" disabled={creditLoading}>
            {creditLoading ? 'Adding...' : 'Add Money'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Password Dialog (existing) */}
      <Dialog open={openPwd} onClose={() => setOpenPwd(false)} maxWidth="xs" fullWidth>
        <DialogTitle className="font-bold text-slate-100 bg-slate-900">Change Password</DialogTitle>
        <DialogContent className="bg-slate-800">
          {pwdError && <Alert severity="error" className="mb-2">{pwdError}</Alert>}
          {pwdSuccess && <Alert severity="success" className="mb-2">{pwdSuccess}</Alert>}
          <TextField
            margin="dense"
            label="Current Password"
            name="currentPassword"
            type="password"
            value={pwdForm.currentPassword}
            onChange={handlePwdChange}
            fullWidth
            variant="outlined"
            className="mb-4"
            InputProps={{ className: 'text-slate-100' }}
          />
          <TextField
            margin="dense"
            label="New Password"
            name="newPassword"
            type="password"
            value={pwdForm.newPassword}
            onChange={handlePwdChange}
            fullWidth
            variant="outlined"
            className="mb-4"
            InputProps={{ className: 'text-slate-100' }}
          />
        </DialogContent>
        <DialogActions className="bg-slate-900">
          <Button onClick={() => setOpenPwd(false)} className="text-slate-300">Cancel</Button>
          <Button onClick={handlePwdSave} variant="contained" className="bg-gradient-to-br from-blue-500 to-blue-700 text-white" disabled={pwdSaving}>
            {pwdSaving ? 'Saving...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeProfile; 