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
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Restaurant,
} from '@mui/icons-material';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0f172a] to-[#1e293b] font-sans">
      <Container maxWidth="sm">
        <Paper 
          elevation={0}
          className="p-12 rounded-[2.5rem] shadow-2xl backdrop-blur-2xl bg-[#1e293b]/80 relative overflow-hidden"
          sx={{
            background: 'rgba(30,41,59,0.85)',
            boxShadow: '0 0 32px 8px #6366f1aa, 0 8px 40px 0 #a78bfa55',
            borderRadius: '2.5rem',
          }}
        >
          {/* Animated Glow Icon */}
          <Box textAlign="center" mb={5}>
            <Box 
              className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse"
              sx={{ boxShadow: '0 0 32px 8px #a78bfa55, 0 4px 32px #6366f1' }}
            >
              <Restaurant sx={{ fontSize: 48, color: 'white', filter: 'drop-shadow(0 0 8px #a78bfa)' }} />
            </Box>
            <Typography 
              variant="h2" 
              component="h1" 
              className="font-extrabold text-slate-100 mb-2 tracking-tight"
              sx={{ letterSpacing: '-0.04em', fontFamily: 'Inter, Roboto, Arial, sans-serif', fontWeight: 900, fontSize: '2.5rem' }}
            >
              Welcome Back
            </Typography>
            <Typography 
              variant="body1" 
              className="text-slate-400 mb-2"
              sx={{ fontSize: '1.1rem' }}
            >
              Sign in to your Canteen Account
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
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
                    <Email className="text-blue-400" />
                  </InputAdornment>
                ),
              }}
              sx={{
                input: { color: '#f1f5f9', background: '#334155', borderRadius: 12, fontSize: '1.1rem', fontFamily: 'Inter, Roboto, Arial, sans-serif' },
                label: { color: '#94a3b8', fontWeight: 500 },
                '& .MuiFilledInput-root': {
                  background: '#334155',
                  borderRadius: 12,
                  boxShadow: '0 2px 12px #6366f122',
                  '&:hover': { background: '#475569' },
                  '&.Mui-focused': { background: '#334155', borderColor: '#6366f1' },
                },
                '& .MuiFilledInput-underline:before': { borderBottom: 'none' },
                '& .MuiFilledInput-underline:after': { borderBottom: 'none' },
              }}
            />

            <Box height={24} />
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
                    <Lock className="text-purple-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#a78bfa' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                input: { color: '#f1f5f9', background: '#334155', borderRadius: 12, fontSize: '1.1rem', fontFamily: 'Inter, Roboto, Arial, sans-serif' },
                label: { color: '#94a3b8', fontWeight: 500 },
                '& .MuiFilledInput-root': {
                  background: '#334155',
                  borderRadius: 12,
                  boxShadow: '0 2px 12px #a78bfa22',
                  '&:hover': { background: '#475569' },
                  '&.Mui-focused': { background: '#334155', borderColor: '#a78bfa' },
                },
                '& .MuiFilledInput-underline:before': { borderBottom: 'none' },
                '& .MuiFilledInput-underline:after': { borderBottom: 'none' },
              }}
            />

            <Box height={32} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              className="h-12 text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#1e293b] animate-gradient-x"
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: '-0.01em',
                boxShadow: '0 4px 32px #6366f1',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 6px 40px #a78bfa',
                  transform: 'scale(1.03)',
                  background: 'linear-gradient(90deg, #6366f1 0%, #a78bfa 100%)',
                },
                borderRadius: '1.5rem',
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Register Link */}
          <Box textAlign="center" mt={5}>
            <Typography variant="body2" className="text-slate-400" sx={{ fontSize: '1.05rem' }}>
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-blue-400 hover:text-purple-400 font-semibold transition-colors"
              >
                Register here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Login; 