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
        <Typography variant="h4" className="font-extrabold text-slate-100 mb-1 tracking-tight" sx={{ fontSize: '1.875rem' }}>Employee Management</Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md rounded-lg"
          sx={{ 
            fontSize: 14, 
            px: 3, 
            py: 1.5, 
            borderRadius: '0.75rem', 
            height: 40,
            fontWeight: 600,
            textTransform: 'none'
          }}
          onClick={handleOpen}
        >
          ADD EMPLOYEE
        </Button>
      </Box>

      {/* Global alerts */}
      {error && <Alert severity="error" className="mb-4 bg-red-900/20 border border-red-500/30 text-red-200">{error}</Alert>}
      {success && <Alert severity="success" className="mb-4 bg-green-900/20 border border-green-500/30 text-green-200">{success}</Alert>}

      <Card 
        className="rounded-2xl shadow-2xl border border-slate-700/50" 
        sx={{ 
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box className="flex justify-center py-16">
              <CircularProgress size={40} sx={{ color: '#3b82f6' }} />
            </Box>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <TableContainer 
                component={Paper} 
                sx={{ 
                  background: 'transparent',
                  boxShadow: 'none'
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow 
                      sx={{ 
                        background: 'linear-gradient(90deg, #334155 0%, #475569 100%)',
                        '& .MuiTableCell-head': {
                          borderBottom: 'none',
                          py: 2.5,
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          letterSpacing: '0.05em'
                        }
                      }}
                    >
                      <TableCell className="text-slate-200">Name</TableCell>
                      <TableCell className="text-slate-200">Email</TableCell>
                      <TableCell className="text-slate-200" align="center">Balance</TableCell>
                      <TableCell className="text-slate-200" align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.length === 0 ? (
                      <TableRow>
                        <TableCell 
                          colSpan={4} 
                          className="text-slate-400 text-center py-12"
                          sx={{ borderBottom: 'none', fontSize: '1rem' }}
                        >
                          No employees found. Add your first employee to get started.
                        </TableCell>
                      </TableRow>
                    ) : employees.map((emp, index) => (
                      <TableRow 
                        key={emp._id} 
                        sx={{
                          '&:hover': {
                            background: 'rgba(51, 65, 85, 0.3)',
                          },
                          '& .MuiTableCell-body': {
                            borderBottom: index === employees.length - 1 ? 'none' : '1px solid rgba(71, 85, 105, 0.3)',
                            py: 2,
                            fontSize: '0.875rem'
                          }
                        }}
                      >
                        <TableCell className="text-slate-100 font-medium">{emp.name}</TableCell>
                        <TableCell className="text-slate-300">{emp.email}</TableCell>
                        <TableCell 
                          align="center"
                          sx={{ 
                            color: emp.balance > 0 ? '#10b981' : emp.balance < 0 ? '#ef4444' : '#94a3b8',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                          }}
                        >
                          ₹{emp.balance?.toLocaleString() || '0'}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Credit Balance" arrow>
                            <IconButton 
                              onClick={() => openCreditDialog(emp.employeeId)}
                              sx={{
                                color: '#10b981',
                                '&:hover': {
                                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Add />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </CardContent>
      </Card>
      {/* Add Employee Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(71, 85, 105, 0.3)',
            borderRadius: '1rem'
          }
        }}
      >
        <DialogTitle 
          className="font-bold text-slate-100"
          sx={{ 
            background: 'linear-gradient(90deg, #334155 0%, #475569 100%)',
            fontSize: '1.25rem',
            py: 2.5
          }}
        >
          Add New Employee
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 3, background: 'transparent' }}>
          {error && <Alert severity="error" className="mb-4 bg-red-900/20 border border-red-500/30 text-red-200">{error}</Alert>}
          {success && <Alert severity="success" className="mb-4 bg-green-900/20 border border-green-500/30 text-green-200">{success}</Alert>}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(51, 65, 85, 0.3)',
                  color: '#f1f5f9',
                  borderRadius: '0.75rem',
                  '& fieldset': { borderColor: 'rgba(71, 85, 105, 0.5)' },
                  '&:hover fieldset': { borderColor: 'rgba(59, 130, 246, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                },
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' }
              }}
            />
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(51, 65, 85, 0.3)',
                  color: '#f1f5f9',
                  borderRadius: '0.75rem',
                  '& fieldset': { borderColor: 'rgba(71, 85, 105, 0.5)' },
                  '&:hover fieldset': { borderColor: 'rgba(59, 130, 246, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                },
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' }
              }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(51, 65, 85, 0.3)',
                  color: '#f1f5f9',
                  borderRadius: '0.75rem',
                  '& fieldset': { borderColor: 'rgba(71, 85, 105, 0.5)' },
                  '&:hover fieldset': { borderColor: 'rgba(59, 130, 246, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                },
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' }
              }}
            />
            <TextField
              label="Employee ID"
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(51, 65, 85, 0.3)',
                  color: '#f1f5f9',
                  borderRadius: '0.75rem',
                  '& fieldset': { borderColor: 'rgba(71, 85, 105, 0.5)' },
                  '&:hover fieldset': { borderColor: 'rgba(59, 130, 246, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                },
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5, background: 'rgba(51, 65, 85, 0.2)' }}>
          <Button 
            onClick={handleClose} 
            sx={{ 
              color: '#94a3b8',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': { backgroundColor: 'rgba(148, 163, 184, 0.1)' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            disabled={saving}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              borderRadius: '0.75rem',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              },
              '&:disabled': {
                background: 'rgba(59, 130, 246, 0.3)',
                color: 'rgba(255, 255, 255, 0.5)'
              }
            }}
          >
            {saving ? 'Adding Employee...' : 'Add Employee'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Credit Employee Dialog */}
      <Dialog 
        open={creditOpen} 
        onClose={closeCreditDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(71, 85, 105, 0.3)',
            borderRadius: '1rem'
          }
        }}
      >
        <DialogTitle 
          className="font-bold text-slate-100"
          sx={{ 
            background: 'linear-gradient(90deg, #059669 0%, #047857 100%)',
            fontSize: '1.25rem',
            py: 2.5
          }}
        >
          Credit Employee Balance
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 3, background: 'transparent' }}>
          {error && <Alert severity="error" className="mb-4 bg-red-900/20 border border-red-500/30 text-red-200">{error}</Alert>}
          {success && <Alert severity="success" className="mb-4 bg-green-900/20 border border-green-500/30 text-green-200">{success}</Alert>}
          
          <Box sx={{ mt: 1 }}>
            <TextField
              label="Credit Amount"
              name="amount"
              value={creditAmount}
              onChange={e => setCreditAmount(e.target.value)}
              fullWidth
              variant="outlined"
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(51, 65, 85, 0.3)',
                  color: '#f1f5f9',
                  borderRadius: '0.75rem',
                  fontSize: '1.1rem',
                  '& fieldset': { borderColor: 'rgba(5, 150, 105, 0.5)' },
                  '&:hover fieldset': { borderColor: 'rgba(5, 150, 105, 0.7)' },
                  '&.Mui-focused fieldset': { borderColor: '#059669' }
                },
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#059669' }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5, background: 'rgba(51, 65, 85, 0.2)' }}>
          <Button 
            onClick={closeCreditDialog} 
            sx={{ 
              color: '#94a3b8',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': { backgroundColor: 'rgba(148, 163, 184, 0.1)' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCredit} 
            variant="contained" 
            disabled={creditLoading || !creditAmount}
            sx={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              borderRadius: '0.75rem',
              '&:hover': {
                background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
              },
              '&:disabled': {
                background: 'rgba(5, 150, 105, 0.3)',
                color: 'rgba(255, 255, 255, 0.5)'
              }
            }}
          >
            {creditLoading ? 'Processing...' : 'Credit Amount'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default EmployeeManagement; 