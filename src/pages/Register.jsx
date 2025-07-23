import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Badge,
  Restaurant,
} from '@mui/icons-material';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    employeeId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.role === 'employee' && !formData.employeeId.trim()) {
      setError('Employee ID is required for employees');
      return;
    }

    setLoading(true);

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      ...(formData.role === 'employee' && { employeeId: formData.employeeId }),
    };

    const result = await register(userData);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      <Container maxWidth="sm">
        <Paper 
          elevation={0}
          className="p-4 rounded-lg shadow-xl backdrop-blur-xl bg-[#1e293b]/80 relative overflow-hidden"
          sx={{
            background: 'rgba(30,41,59,0.85)',
            boxShadow: '0 0 12px 2px #6366f1aa, 0 2px 16px 0 #a78bfa55',
            borderRadius: '0.75rem',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={3}>
            <Box 
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg animate-pulse"
              sx={{ boxShadow: '0 0 12px 2px #a78bfa55, 0 2px 12px #6366f1' }}
            >
              <Restaurant sx={{ fontSize: 24, color: 'white', filter: 'drop-shadow(0 0 2px #a78bfa)' }} />
            </Box>
            <Typography 
              variant="h3" 
              component="h1" 
              className="font-extrabold text-slate-100 mb-1 tracking-tight"
              sx={{ letterSpacing: '-0.02em', fontFamily: 'Inter, Roboto, Arial, sans-serif', fontWeight: 900 }}
            >
              Create Account
            </Typography>
            <Typography 
              variant="body1" 
              className="text-slate-400 mb-1"
            >
              Join the Canteen Management System
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              variant="filled"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person className="text-blue-400" sx={{ fontSize: 20 }} />
                  </InputAdornment>
                ),
                disableUnderline: true,
              }}
              sx={{
                input: { color: '#f1f5f9', background: '#334155', borderRadius: 8, fontSize: '0.9rem', fontFamily: 'Inter, Roboto, Arial, sans-serif' },
                label: { color: '#94a3b8', fontWeight: 500, fontSize: '0.875rem' },
                '& .MuiFilledInput-root': {
                  background: '#334155',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px #6366f122',
                  '&:hover': { background: '#475569' },
                  '&.Mui-focused': { background: '#334155', borderColor: '#6366f1' },
                },
                '& .MuiFilledInput-underline:before': { borderBottom: 'none' },
                '& .MuiFilledInput-underline:after': { borderBottom: 'none' },
              }}
            />

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              variant="filled"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email className="text-blue-400" sx={{ fontSize: 20 }} />
                  </InputAdornment>
                ),
                disableUnderline: true,
              }}
              sx={{
                input: { color: '#f1f5f9', background: '#334155', borderRadius: 8, fontSize: '0.9rem', fontFamily: 'Inter, Roboto, Arial, sans-serif' },
                label: { color: '#94a3b8', fontWeight: 500, fontSize: '0.875rem' },
                '& .MuiFilledInput-root': {
                  background: '#334155',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px #6366f122',
                  '&:hover': { background: '#475569' },
                  '&.Mui-focused': { background: '#334155', borderColor: '#6366f1' },
                },
                '& .MuiFilledInput-underline:before': { borderBottom: 'none' },
                '& .MuiFilledInput-underline:after': { borderBottom: 'none' },
              }}
            />

            <FormControl fullWidth variant="filled" sx={{ mt: 0, mb: 0, '& .MuiFilledInput-root': { background: '#334155', borderRadius: 2, boxShadow: '0 2px 8px #6366f122' }, '& .MuiFilledInput-underline:before': { borderBottom: 'none' }, '& .MuiFilledInput-underline:after': { borderBottom: 'none' }, }}>
              <InputLabel sx={{ color: '#94a3b8', fontWeight: 500, fontSize: '0.875rem' }}>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Role"
                disableUnderline
                sx={{
                  borderRadius: 8,
                  color: '#f1f5f9',
                  background: '#334155',
                  fontSize: '0.9rem',
                  '& .MuiSelect-select': { color: '#f1f5f9' },
                  '&:hover': { background: '#475569' },
                  '&.Mui-focused': { background: '#334155', borderColor: '#6366f1' },
                }}
              >
                <MenuItem value="employee">Employee</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            {formData.role === 'employee' && (
              <TextField
                fullWidth
                label="Employee ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge className="text-blue-400" sx={{ fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  disableUnderline: true,
                }}
                sx={{
                  input: { color: '#f1f5f9', background: '#334155', borderRadius: 8, fontSize: '0.9rem', fontFamily: 'Inter, Roboto, Arial, sans-serif' },
                  label: { color: '#94a3b8', fontWeight: 500, fontSize: '0.875rem' },
                  '& .MuiFilledInput-root': {
                    background: '#334155',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px #6366f122',
                    '&:hover': { background: '#475569' },
                    '&.Mui-focused': { background: '#334155', borderColor: '#6366f1' },
                  },
                  '& .MuiFilledInput-underline:before': { borderBottom: 'none' },
                  '& .MuiFilledInput-underline:after': { borderBottom: 'none' },
                }}
              />
            )}

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              variant="filled"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="text-purple-400" sx={{ fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#a78bfa' }}
                    >
                      {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
                disableUnderline: true,
              }}
              sx={{
                input: { color: '#f1f5f9', background: '#334155', borderRadius: 8, fontSize: '0.9rem', fontFamily: 'Inter, Roboto, Arial, sans-serif' },
                label: { color: '#94a3b8', fontWeight: 500, fontSize: '0.875rem' },
                '& .MuiFilledInput-root': {
                  background: '#334155',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px #6366f122',
                  '&:hover': { background: '#475569' },
                  '&.Mui-focused': { background: '#334155', borderColor: '#a78bfa' },
                },
                '& .MuiFilledInput-underline:before': { borderBottom: 'none' },
                '& .MuiFilledInput-underline:after': { borderBottom: 'none' },
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              variant="filled"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="text-purple-400" sx={{ fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: '#a78bfa' }}
                    >
                      {showConfirmPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
                disableUnderline: true,
              }}
              sx={{
                input: { color: '#f1f5f9', background: '#334155', borderRadius: 8, fontSize: '0.9rem', fontFamily: 'Inter, Roboto, Arial, sans-serif' },
                label: { color: '#94a3b8', fontWeight: 500, fontSize: '0.875rem' },
                '& .MuiFilledInput-root': {
                  background: '#334155',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px #6366f122',
                  '&:hover': { background: '#475569' },
                  '&.Mui-focused': { background: '#334155', borderColor: '#a78bfa' },
                },
                '& .MuiFilledInput-underline:before': { borderBottom: 'none' },
                '& .MuiFilledInput-underline:after': { borderBottom: 'none' },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              className="h-9 text-sm font-bold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 shadow-md hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#1e293b] mt-4"
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                letterSpacing: '-0.01em',
                boxShadow: '0 2px 8px #6366f1',
                '&:hover': {
                  boxShadow: '0 3px 16px #6366f1',
                  transform: 'scale(1.02)',
                },
                borderRadius: '0.5rem',
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <Box textAlign="center" mt={3}>
            <Typography variant="body2" className="text-slate-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-blue-400 hover:text-purple-400 font-semibold transition-colors"
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Register; 