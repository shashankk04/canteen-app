import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Typography, Box, Card, CardContent, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Tooltip, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert
} from '@mui/material';
import { Add, Edit, Delete, PersonAdd, People } from '@mui/icons-material';
import api from '../../utils/api';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', employeeId: '' });
  const [saving, setSaving] = useState(false);
  const [creditOpen, setCreditOpen] = useState(false);
  const [creditEmployeeId, setCreditEmployeeId] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [creditLoading, setCreditLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (e) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setForm({ name: '', email: '', password: '', employeeId: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm({ name: '', email: '', password: '', employeeId: '' });
  };

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    // Validation
    if (!form.name || !form.email || !form.password || !form.employeeId) {
      setError('All fields are required.');
      return;
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/employees', form);
      fetchEmployees();
      handleClose();
      setSuccess('Employee added successfully!');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to add employee');
    } finally {
      setSaving(false);
    }
  };

  const handleCreditBalance = async (id, amount) => {
    if (!window.confirm(`Credit ${amount} to employee?`)) return;
    try {
      await api.post(`/employees/${id}/credit`, { amount });
      fetchEmployees();
    } catch (e) {
      // handle error
    }
  };

  const handleViewTransactions = async (id) => {
    try {
      const res = await api.get(`/employees/${id}/transactions`);
      // For simplicity, we'll just show a message. In a real app, you'd render a dialog with transactions.
      alert(`Transactions for Employee ID ${id}: ${JSON.stringify(res.data)}`);
    } catch (e) {
      // handle error
    }
  };

  const openCreditDialog = (employeeId) => {
    setCreditEmployeeId(employeeId);
    setCreditAmount("");
    setCreditOpen(true);
  };
  const closeCreditDialog = () => {
    setCreditOpen(false);
    setCreditEmployeeId("");
    setCreditAmount("");
  };

  const handleCredit = async () => {
    setCreditLoading(true);
    setError('');
    setSuccess('');
    const amt = parseFloat(creditAmount);
    if (isNaN(amt) || amt <= 0) {
      setError('Enter a valid positive amount');
      setCreditLoading(false);
      return;
    }
    try {
      await api.post("/employees/credit", {
        employeeId: creditEmployeeId,
        amount: amt,
      });
      fetchEmployees();
      closeCreditDialog();
      setSuccess('Amount credited successfully!');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to credit amount');
    } finally {
      setCreditLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Box className="mb-8 flex items-center justify-between">
        <Box>
          <Typography variant="h4" className="font-extrabold text-slate-100 mb-1 tracking-tight">Employee Management</Typography>
          <Typography variant="body1" className="text-slate-400">Add, edit, and manage all employees</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          className="bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg rounded-xl"
          onClick={() => handleOpen()}
        >
          Add Employee
        </Button>
      </Box>
      <Card className="rounded-2xl shadow-xl bg-gradient-to-br from-slate-800 to-slate-900 bg-opacity-80 backdrop-blur-xl border border-[#334155]/40">
        <CardContent>
          {loading ? (
            <Box className="flex justify-center py-10">
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} className="bg-transparent">
              <Table>
                <TableHead>
                  <TableRow className="bg-slate-800/80">
                    <TableCell className="text-slate-200 font-bold">Name</TableCell>
                    <TableCell className="text-slate-200 font-bold">Email</TableCell>
                    <TableCell className="text-slate-200 font-bold">Balance</TableCell>
                    <TableCell className="text-slate-200 font-bold">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map(emp => (
                    <TableRow key={emp._id} className="hover:bg-slate-700/40 transition">
                      <TableCell className="text-slate-100">{emp.name}</TableCell>
                      <TableCell className="text-slate-100">{emp.email}</TableCell>
                      <TableCell className="text-slate-100">₹{emp.balance}</TableCell>
                      <TableCell>
                        <Tooltip title="Credit Balance">
                          <IconButton onClick={() => openCreditDialog(emp.employeeId)}>
                            <Add className="text-green-400" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
      {/* Add Employee Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle className="font-bold text-slate-100 bg-slate-900">Add Employee</DialogTitle>
        <DialogContent className="bg-slate-800">
          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          {success && <Alert severity="success" className="mb-4">{success}</Alert>}
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            className="mb-4"
            InputProps={{ className: 'text-slate-100' }}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            className="mb-4"
            InputProps={{ className: 'text-slate-100' }}
          />
          <TextField
            margin="dense"
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            className="mb-4"
            InputProps={{ className: 'text-slate-100' }}
          />
          <TextField
            margin="dense"
            label="Employee ID"
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            className="mb-4"
            InputProps={{ className: 'text-slate-100' }}
          />
        </DialogContent>
        <DialogActions className="bg-slate-900">
          <Button onClick={handleClose} className="text-slate-300">Cancel</Button>
          <Button onClick={handleSave} variant="contained" className="bg-gradient-to-br from-blue-500 to-blue-700 text-white" disabled={saving}>
            {saving ? 'Saving...' : 'Add Employee'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Credit Employee Dialog */}
      <Dialog open={creditOpen} onClose={closeCreditDialog} maxWidth="xs" fullWidth>
        <DialogTitle className="font-bold text-slate-100 bg-slate-900">Credit Employee Balance</DialogTitle>
        <DialogContent className="bg-slate-800">
          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          {success && <Alert severity="success" className="mb-4">{success}</Alert>}
          <TextField
            margin="dense"
            label="Amount"
            name="amount"
            value={creditAmount}
            onChange={e => setCreditAmount(e.target.value)}
            fullWidth
            variant="outlined"
            type="number"
            className="mb-4"
            InputProps={{ className: 'text-slate-100' }}
          />
        </DialogContent>
        <DialogActions className="bg-slate-900">
          <Button onClick={closeCreditDialog} className="text-slate-300">Cancel</Button>
          <Button onClick={handleCredit} variant="contained" className="bg-gradient-to-br from-green-500 to-green-700 text-white" disabled={creditLoading || !creditAmount}>
            {creditLoading ? 'Crediting...' : 'Credit'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default EmployeeManagement; 