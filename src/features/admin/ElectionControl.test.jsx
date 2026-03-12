import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ElectionControl from './ElectionControl';
import { useData } from '../../shared/context/DataContext';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../shared/context/DataContext', () => ({
  useData: vi.fn()
}));

vi.mock('../../shared/services/api', () => ({
  electionAPI: {
    start: vi.fn(),
    suspend: vi.fn(),
    close: vi.fn()
  }
}));

describe('ElectionControl', () => {
  const mockUpdateElection = vi.fn();
  const mockElections = [
    { id: '1', title: 'Election 1', status: 'pending' },
    { id: '2', title: 'Election 2', status: 'active' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useData.mockReturnValue({
      elections: mockElections,
      updateElection: mockUpdateElection
    });
    // Mock alert
    vi.stubGlobal('alert', vi.fn());
  });

  const renderElectionControl = () => {
    return render(
      <BrowserRouter>
        <ElectionControl />
      </BrowserRouter>
    );
  };

  it('renders control cards for pending and active elections', () => {
    renderElectionControl();
    expect(screen.getByRole('heading', { level: 3, name: /Start Voting/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Pause Voting/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Close Election/i })).toBeInTheDocument();
  });

  it('starts a pending election when Start Voting is clicked', async () => {
    renderElectionControl();
    const startButton = screen.getByRole('button', { name: /Start Voting/i });
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(mockUpdateElection).toHaveBeenCalledWith('1', { status: 'active' });
      expect(window.alert).toHaveBeenCalledWith('Election started successfully!');
    });
  });

  it('pauses an active election when Pause Voting is clicked', async () => {
    renderElectionControl();
    const pauseButton = screen.getByRole('button', { name: /Pause Voting/i });
    fireEvent.click(pauseButton);

    await waitFor(() => {
      expect(mockUpdateElection).toHaveBeenCalledWith('2', { status: 'suspended' });
      expect(window.alert).toHaveBeenCalledWith('Election paused successfully!');
    });
  });

  it('closes an active election when Close Election is clicked', async () => {
    renderElectionControl();
    const closeButton = screen.getByRole('button', { name: /Close Election/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(mockUpdateElection).toHaveBeenCalledWith('2', { status: 'closed' });
      expect(window.alert).toHaveBeenCalledWith('Election closed successfully!');
    });
  });
});
