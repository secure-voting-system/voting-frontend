import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { useAuth } from '../../shared/context/AuthContext';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../shared/context/AuthContext', () => ({
  useAuth: vi.fn()
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Login', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      login: mockLogin
    });
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it('renders login form elements', () => {
    renderLogin();
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('updates input fields on change', () => {
    renderLogin();
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('submits the form and navigates on success (admin)', async () => {
    mockLogin.mockResolvedValue({ success: true, user: { role: 'admin' } });
    renderLogin();

    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@example.com', 'admin123');
      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  it('submits the form and navigates on success (voter)', async () => {
    mockLogin.mockResolvedValue({ success: true, user: { role: 'voter' } });
    renderLogin();

    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'voter@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'voter123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('voter@example.com', 'voter123');
      expect(mockNavigate).toHaveBeenCalledWith('/voter/dashboard');
    });
  });

  it('displays error message on login failure', async () => {
    mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' });
    renderLogin();

    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});
