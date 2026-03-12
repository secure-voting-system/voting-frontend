import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';
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
    useNavigate: () => mockNavigate,
    Link: ({ children, to }) => <a href={to}>{children}</a>
  };
});

describe('Register', () => {
  const mockRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      register: mockRegister
    });
  });

  const renderRegister = () => {
    return render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
  };

  it('renders registration form elements', () => {
    renderRegister();
    expect(screen.getByRole('heading', { level: 1, name: /Create Account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Voter ID/i)).toBeInTheDocument();
  });

  it('updates form data on input change', () => {
    renderRegister();
    const nameInput = screen.getByPlaceholderText(/John Doe/i);
    fireEvent.change(nameInput, { target: { name: 'name', value: 'Jane Doe' } });
    expect(nameInput.value).toBe('Jane Doe');
  });

  it('shows Admin Secret field when Admin role is selected', () => {
    renderRegister();
    // Initially voter role is selected, Admin Secret should not be visible
    expect(screen.queryByLabelText(/Admin Secret/i)).not.toBeInTheDocument();

    // Select Admin role
    const adminRadio = screen.getByLabelText(/Admin/i);
    fireEvent.click(adminRadio);

    expect(screen.getByLabelText(/Admin Secret/i)).toBeInTheDocument();
  });

  it('validates password match', async () => {
    renderRegister();
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { name: 'name', value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { name: 'email', value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/Voter ID/i), { target: { name: 'voterId', value: 'V123' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { name: 'password', value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { name: 'confirmPassword', value: 'different' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('submits successfully and navigates for voter', async () => {
    mockRegister.mockResolvedValue({ success: true, user: { role: 'voter' } });
    renderRegister();

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { name: 'name', value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { name: 'email', value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/Voter ID/i), { target: { name: 'voterId', value: 'V123' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { name: 'password', value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { name: 'confirmPassword', value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('jane@example.com', 'password123', 'Jane Doe', 'voter', 'V123', '');
      expect(mockNavigate).toHaveBeenCalledWith('/voter/dashboard');
    });
  });
});
