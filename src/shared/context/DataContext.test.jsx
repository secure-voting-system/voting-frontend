import { renderHook, act } from '@testing-library/react';
import { DataProvider, useData } from './DataContext';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../services/api', () => ({
  electionAPI: {
    getAll: vi.fn().mockResolvedValue([]),
  },
  candidateAPI: {
    getByElection: vi.fn().mockResolvedValue([]),
  },
  voteAPI: {
    cast: vi.fn().mockResolvedValue({ voteId: 'vote-1', receipt: 'receipt-1' }),
    verifyReceipt: vi.fn().mockResolvedValue({ verified: true, receipt: {} }),
    hasVoted: vi.fn().mockResolvedValue({ hasVoted: false }),
    getActiveElections: vi.fn().mockResolvedValue([]),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key) => { delete store[key]; }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('DataContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('provides initial state', () => {
    const wrapper = ({ children }) => <DataProvider>{children}</DataProvider>;
    const { result } = renderHook(() => useData(), { wrapper });

    expect(result.current.elections).toBeDefined();
    expect(result.current.candidates).toBeDefined();
  });

  it('can cast a vote', async () => {
    const wrapper = ({ children }) => <DataProvider>{children}</DataProvider>;
    const { result } = renderHook(() => useData(), { wrapper });

    const userId = 'test-user-1';
    const electionId = 'election-1';
    const candidateId = 'candidate-1';

    let response;
    await act(async () => {
      response = await result.current.submitVote(userId, electionId, candidateId);
    });

    expect(response.success).toBe(true);
    expect(result.current.hasUserVoted(userId, electionId)).toBe(true);
  });
});
