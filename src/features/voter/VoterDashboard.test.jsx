import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VoterDashboard from './VoterDashboard';
import { useAuth } from '../../shared/context/AuthContext';
import { useData } from '../../shared/context/DataContext';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../shared/context/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('../../shared/context/DataContext', () => ({
  useData: vi.fn()
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

vi.mock('../../shared/components/ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle">ThemeToggle</div>
}));

describe('VoterDashboard', () => {
  const mockLogout = vi.fn();
  const mockGetUserVotes = vi.fn();
  const mockHasUserVoted = vi.fn();
  const mockGetVoteByReceipt = vi.fn();
  const mockUser = { id: 'u1', name: 'Test Voter' };
  const mockElections = [
    { id: 'e1', title: 'Active Election', status: 'active', startDate: new Date(Date.now() - 3600000).toISOString(), endDate: new Date(Date.now() + 3600000).toISOString(), votedCount: 10, totalVoters: 100 }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout
    });
    useData.mockReturnValue({
      elections: mockElections,
      getUserVotes: mockGetUserVotes,
      hasUserVoted: mockHasUserVoted,
      getVoteByReceipt: mockGetVoteByReceipt
    });
    mockGetUserVotes.mockReturnValue([]);
    mockHasUserVoted.mockReturnValue(false);
  });

  const renderVoterDashboard = () => {
    return render(
      <BrowserRouter>
        <VoterDashboard />
      </BrowserRouter>
    );
  };

  it('renders welcome message and stats', () => {
    renderVoterDashboard();
    expect(screen.getByText(/Welcome back, Test Voter!/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Elections/i)).toBeInTheDocument();
    expect(screen.getByText(/Votes Cast/i)).toBeInTheDocument();
  });

  it('handles receipt lookup - not found', async () => {
    mockGetVoteByReceipt.mockResolvedValue(null);
    renderVoterDashboard();

    const input = screen.getByPlaceholderText(/Enter receipt ID/i);
    fireEvent.change(input, { target: { value: 'VOTE-INVALID' } });
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));

    await waitFor(() => {
      expect(screen.getByText(/Receipt not found in ledger/i)).toBeInTheDocument();
    });
  });

  it('handles receipt lookup - found', async () => {
    mockGetVoteByReceipt.mockResolvedValue({ receiptId: 'VOTE-123', timestamp: Date.now() });
    renderVoterDashboard();

    fireEvent.change(screen.getByPlaceholderText(/Enter receipt ID/i), { target: { value: 'VOTE-123' } });
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));

    await waitFor(() => {
      expect(screen.getByText(/Vote Verified/i)).toBeInTheDocument();
      expect(screen.getByText(/Ref: VOTE-123/i)).toBeInTheDocument();
    });
  });

  it('calls logout when logout button is clicked', () => {
    renderVoterDashboard();
    fireEvent.click(screen.getByRole('button', { name: /Logout/i }));
    expect(mockLogout).toHaveBeenCalled();
  });

  it('shows "Cast Vote" button for active elections user has NOT voted in', () => {
    mockHasUserVoted.mockReturnValue(false);
    renderVoterDashboard();
    expect(screen.getByRole('button', { name: /Cast Vote/i })).toBeInTheDocument();
  });

  it('shows "Already Voted" button for active elections user HAS voted in', () => {
    mockHasUserVoted.mockReturnValue(true);
    renderVoterDashboard();
    expect(screen.getByRole('button', { name: /Already Voted/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Already Voted/i })).toBeDisabled();
  });
});
