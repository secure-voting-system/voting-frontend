import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useParams } from 'react-router-dom';
import VotingPage from './VotingPage';
import { useAuth } from '../../shared/context/AuthContext';
import { useData } from '../../shared/context/DataContext';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../shared/context/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('../../shared/context/DataContext', () => ({
  useData: vi.fn()
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: () => vi.fn()
  };
});

describe('VotingPage', () => {
  const mockSubmitVote = vi.fn();
  const mockLoadCandidates = vi.fn();
  const mockGetCandidates = vi.fn();
  const mockHasVoted = vi.fn();
  const mockUser = { id: 'u1' };
  const mockElection = { id: 'e1', title: 'Test Election', votedCount: 0, totalVoters: 100, endDate: new Date(Date.now() + 86400000).toISOString() };
  const mockCandidates = [
    { id: 'c1', name: 'Candidate A', role: 'Role A' },
    { id: 'c2', name: 'Candidate B', role: 'Role B' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useParams.mockReturnValue({ electionId: 'e1' });
    useAuth.mockReturnValue({ user: mockUser });
    useData.mockReturnValue({
      elections: [mockElection],
      getCandidatesByElection: mockGetCandidates,
      loadCandidatesForElection: mockLoadCandidates,
      submitVote: mockSubmitVote,
      hasUserVoted: mockHasVoted
    });
    mockGetCandidates.mockReturnValue(mockCandidates);
    mockHasVoted.mockReturnValue(false);
  });

  const renderVotingPage = () => {
    return render(
      <BrowserRouter>
        <VotingPage />
      </BrowserRouter>
    );
  };

  it('renders election details and candidates', () => {
    renderVotingPage();
    expect(screen.getByText(/Test Election/i)).toBeInTheDocument();
    expect(screen.getByText(/Candidate A/i)).toBeInTheDocument();
    expect(screen.getByText(/Candidate B/i)).toBeInTheDocument();
  });

  it('handles candidate selection', () => {
    renderVotingPage();
    const candidateA = screen.getByText(/Candidate A/i);
    fireEvent.click(candidateA);

    const submitButton = screen.getByRole('button', { name: /Submit Vote/i });
    expect(submitButton).not.toBeDisabled();
    expect(submitButton).toHaveStyle({ opacity: '1' });
  });

  it('submits a vote and shows receipt', async () => {
    const mockVoteResponse = { id: 'v1', receiptId: 'VOTE-REC', candidateId: 'c1', timestamp: Date.now() };
    mockSubmitVote.mockResolvedValue({ success: true, vote: mockVoteResponse });
    renderVotingPage();

    fireEvent.click(screen.getByText(/Candidate A/i));
    fireEvent.click(screen.getByRole('button', { name: /Submit Vote/i }));

    await waitFor(() => {
      expect(mockSubmitVote).toHaveBeenCalledWith('u1', 'e1', 'c1');
      expect(screen.getByText(/Vote Submitted!/i)).toBeInTheDocument();
      expect(screen.getByText(/VOTE-REC/i)).toBeInTheDocument();
    });
  });

  it('shows error message on submission failure', async () => {
    mockSubmitVote.mockResolvedValue({ success: false, error: 'Network error' });
    renderVotingPage();

    fireEvent.click(screen.getByText(/Candidate A/i));
    fireEvent.click(screen.getByRole('button', { name: /Submit Vote/i }));

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  it('shows "Already Voted" if user has already cast a vote', () => {
    mockHasVoted.mockReturnValue(true);
    renderVotingPage();
    expect(screen.getByText(/Already Voted/i)).toBeInTheDocument();
  });
});
