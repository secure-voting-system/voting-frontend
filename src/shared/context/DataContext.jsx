import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { electionAPI, candidateAPI, voteAPI } from '../services/api';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState([]);
  const [pendingVoters, setPendingVoters] = useState([]);

  const normalizeElection = (election) => {
    if (!election) return null;

    const toDateString = (value) => {
      if (!value) return '';
      if (typeof value === 'number') {
        return new Date(value * 1000).toISOString();
      }
      return new Date(value).toISOString();
    };

    return {
      id: election.electionId || election.id,
      title: election.name || election.title,
      description: election.description || '',
      startDate: toDateString(election.startTime || election.startDate),
      endDate: toDateString(election.endTime || election.endDate),
      status: election.status || 'pending',
      totalVoters: Number.isFinite(election.totalVoters) ? election.totalVoters : 100,
      votedCount: Number.isFinite(election.votedCount) ? election.votedCount : 0,
      raw: election,
    };
  };

  const normalizeCandidate = (candidate) => {
    if (!candidate) return null;
    return {
      id: candidate.candidateId || candidate.id,
      electionId: candidate.electionId,
      name: candidate.name,
      role: candidate.party || candidate.role || '',
      bio: candidate.bio || '',
      photo: candidate.photo || '',
    };
  };

  // Load data from API on mount
  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [electionsResponse] = await Promise.all([
          electionAPI.getAll(),
        ]);

        const normalized = (Array.isArray(electionsResponse) ? electionsResponse : electionsResponse?.elections || [])
          .map(normalizeElection)
          .filter(Boolean);

        setElections(normalized);
      } catch (error) {
        console.error('Failed to load elections', error);
      }

      const storedVotes = JSON.parse(localStorage.getItem('vortex_votes') || '[]');
      setVotes(storedVotes);
    };

    loadInitial();
  }, []);

  // Elections
  const createElection = async (electionData) => {
    const payload = {
      electionId: electionData.id,
      name: electionData.title,
      description: electionData.description,
      startTime: electionData.startDate,
      endTime: electionData.endDate,
    };

    const created = await electionAPI.create(payload);
    const normalized = normalizeElection(created);
    setElections((prev) => [...prev, normalized]);
    return normalized;
  };

  const updateElection = (id, updates) => {
    setElections((prev) => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteElection = async (id) => {
    try {
      await electionAPI.delete(id);
      setElections((prev) => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error('Failed to delete election', error);
      throw error;
    }
  };

  // Candidates
  const createCandidate = async (candidateData) => {
    const candidateId = candidateData.id || `candidate-${Date.now()}`;
    const payload = {
      candidateId,
      name: candidateData.name,
      party: candidateData.role,
    };

    const created = await candidateAPI.create(candidateData.electionId, payload);
    const normalized = normalizeCandidate({ ...created, electionId: candidateData.electionId });
    setCandidates((prev) => [...prev, normalized]);
    return normalized;
  };

  const updateCandidate = (id, updates) => {
    setCandidates((prev) => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCandidate = (id) => {
    setCandidates((prev) => prev.filter(c => c.id !== id));
  };

  const getCandidatesByElection = (electionId) => {
    return candidates.filter(c => c.electionId === electionId);
  };

  const loadCandidatesForElection = useCallback(async (electionId) => {
    try {
      const fetched = await candidateAPI.getByElection(electionId);
      const normalized = (Array.isArray(fetched) ? fetched : [])
        .map((candidate) => normalizeCandidate({ ...candidate, electionId }))
        .filter(Boolean);

      setCandidates((prev) => {
        const filtered = prev.filter(c => c.electionId !== electionId);
        return [...filtered, ...normalized];
      });
    } catch (error) {
      console.error('Failed to load candidates', error);
    }
  }, []);

  // Votes
  const submitVote = async (userId, electionId, candidateId) => {
    try {
      const existingVote = votes.find(v => v.userId === userId && v.electionId === electionId);
      if (existingVote) {
        return { success: false, error: 'Already voted in this election' };
      }

      const result = await voteAPI.cast(electionId, candidateId);
      const receiptId =
        result?.receipt?.receiptId ||
        result?.receipt?.ReceiptID ||
        result?.receipt ||
        '';

      const newVote = {
        id: result.voteId || `vote-${Date.now()}`,
        userId,
        electionId,
        candidateId,
        timestamp: new Date().toISOString(),
        receiptId,
      };

      setVotes((prev) => {
        const updated = [...prev, newVote];
        localStorage.setItem('vortex_votes', JSON.stringify(updated));
        return updated;
      });

      setElections((prev) => prev.map(e =>
        e.id === electionId ? { ...e, votedCount: (e.votedCount || 0) + 1 } : e
      ));

      return { success: true, vote: newVote };
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to cast vote';
      return { success: false, error: message };
    }
  };

  const getUserVotes = (userId) => {
    return votes.filter(v => v.userId === userId);
  };

  const getVoteByReceipt = async (receiptId) => {
    const localVote = votes.find(v => v.receiptId === receiptId);
    if (localVote) return localVote;

    try {
      const result = await voteAPI.verifyReceipt(receiptId);
      return result?.receipt ? { receiptId, ...result.receipt } : null;
    } catch (error) {
      return null;
    }
  };

  const hasUserVoted = (userId, electionId) => {
    return votes.some(v => v.userId === userId && v.electionId === electionId);
  };

  // Pending Voters
  const approveVoter = (voterId) => {
    const updated = pendingVoters.filter(v => v.id !== voterId);
    setPendingVoters(updated);
  };

  const rejectVoter = (voterId) => {
    const updated = pendingVoters.filter(v => v.id !== voterId);
    setPendingVoters(updated);
  };

  const value = {
    elections,
    candidates,
    votes,
    pendingVoters,
    createElection,
    updateElection,
    deleteElection,
    createCandidate,
    updateCandidate,
    deleteCandidate,
    getCandidatesByElection,
    loadCandidatesForElection,
    submitVote,
    getUserVotes,
    getVoteByReceipt,
    hasUserVoted,
    approveVoter,
    rejectVoter
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
