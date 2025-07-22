import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import ItemManagement from './pages/admin/ItemManagement';
import TransactionHistory from './pages/admin/TransactionHistory';
import EmployeeProfile from './pages/employee/EmployeeProfile';
import MenuView from './pages/employee/MenuView';
import Passbook from './pages/employee/Passbook';
import EmployeeLayout from './components/layout/EmployeeLayout';

// Create Material UI dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60a5fa', // blue-400
    },
    secondary: {
      main: '#a78bfa', // purple-400
    },
    background: {
      default: '#0f172a', // slate-900
      paper: '#1e293b', // slate-800
    },
    error: {
      main: '#f87171', // red-400
    },
    success: {
      main: '#34d399', // green-400
    },
    warning: {
      main: '#fbbf24', // yellow-400
    },
    info: {
      main: '#38bdf8', // sky-400
    },
    text: {
      primary: '#f1f5f9', // slate-100
      secondary: '#94a3b8', // slate-400
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeightBold: 700,
    fontWeightMedium: 500,
    fontWeightRegular: 400,
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <div>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Admin routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/employees" 
                element={
                  <ProtectedRoute role="admin">
                    <EmployeeManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/items" 
                element={
                  <ProtectedRoute role="admin">
                    <ItemManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/transactions" 
                element={
                  <ProtectedRoute role="admin">
                    <TransactionHistory />
                  </ProtectedRoute>
                } 
              />
              {/* Employee routes with layout */}
              <Route path="/employee" element={<ProtectedRoute role="employee"><EmployeeLayout /></ProtectedRoute>}>
                <Route index element={<EmployeeDashboard />} />
                <Route path="profile" element={<EmployeeProfile />} />
                <Route path="menu" element={<MenuView />} />
                <Route path="passbook" element={<Passbook />} />
              </Route>
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
