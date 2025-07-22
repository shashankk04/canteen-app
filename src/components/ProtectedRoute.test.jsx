import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Mock useAuth context
jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));
const { useAuth } = require('../contexts/AuthContext');

describe('ProtectedRoute', () => {
  afterEach(() => jest.clearAllMocks());

  it('renders children when authenticated and role matches', () => {
    useAuth.mockReturnValue({ user: { role: 'employee' }, loading: false, isAuthenticated: true });
    render(
      <MemoryRouter>
        <ProtectedRoute role="employee">
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', () => {
    useAuth.mockReturnValue({ user: null, loading: false, isAuthenticated: false });
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    // Should not render children
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    // Should render nothing or fallback (Navigate doesn't render anything)
  });

  it('redirects to correct dashboard if role does not match', () => {
    useAuth.mockReturnValue({ user: { role: 'admin' }, loading: false, isAuthenticated: true });
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <ProtectedRoute role="employee">
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('shows loading spinner when loading', () => {
    useAuth.mockReturnValue({ user: null, loading: true, isAuthenticated: false });
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
}); 