import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import EmployeeDashboard from './EmployeeDashboard';
import { MemoryRouter } from 'react-router-dom';

// Mock useAuth context
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));
const { useAuth } = require('../../contexts/AuthContext');

// Mock api
jest.mock('../../utils/api', () => ({
  get: jest.fn(),
}));
const api = require('../../utils/api');

describe('EmployeeDashboard', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ user: { name: 'Test User' }, loading: false });
  });
  afterEach(() => jest.clearAllMocks());

  it('renders welcome message with user name', async () => {
    api.get.mockResolvedValueOnce({ data: { balance: 100, totalSpent: 50, purchases: 5 } });
    api.get.mockResolvedValueOnce({ data: [] });
    render(
      <MemoryRouter>
        <EmployeeDashboard />
      </MemoryRouter>
    );
    expect(screen.getByText(/Welcome, Test User/i)).toBeInTheDocument();
    await waitFor(() => expect(api.get).toHaveBeenCalled());
  });

  it('shows loading indicators for metrics and recent activity', () => {
    useAuth.mockReturnValue({ user: { name: 'Test User' }, loading: false });
    render(
      <MemoryRouter>
        <EmployeeDashboard />
      </MemoryRouter>
    );
    // CircularProgress is shown initially
    expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0);
  });

  it('displays error alert when error occurs', async () => {
    api.get.mockRejectedValueOnce({ response: { data: { message: 'Failed to fetch dashboard metrics' } } });
    api.get.mockResolvedValueOnce({ data: [] });
    render(
      <MemoryRouter>
        <EmployeeDashboard />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText(/Error:/i)).toBeInTheDocument());
    expect(screen.getByText(/Failed to fetch dashboard metrics/i)).toBeInTheDocument();
  });

  it('renders quick links', async () => {
    api.get.mockResolvedValueOnce({ data: { balance: 100, totalSpent: 50, purchases: 5 } });
    api.get.mockResolvedValueOnce({ data: [] });
    render(
      <MemoryRouter>
        <EmployeeDashboard />
      </MemoryRouter>
    );
    await waitFor(() => expect(api.get).toHaveBeenCalled());
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Passbook')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
}); 