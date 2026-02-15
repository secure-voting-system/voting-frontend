import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateId } from '../data/mockData';

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

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedElections = JSON.parse(localStorage.getItem('vortex_elections') || '[]');
    const loadedCandidates = JSON.parse(localStorage.getItem('vortex_candidates') || '[]');
    const loadedVotes = JSON.parse(localStorage.getItem('vortex_votes') || '[]');
    const loadedPending = JSON.parse(localStorage.getItem('vortex_pending_voters') || '[]');

    setElections(loadedElections);
    setCandidates(loadedCandidates);
    setVotes(loadedVotes);
    setPendingVoters(loadedPending);
  }, []);

  // Elections
  const createElection = (electionData) => {
    const newElection = {
      id: generateId(),
      ...electionData,
      status: 'pending',
      totalVoters: 0,
      votedCount: 0
    };
    const updated = [...elections, newElection];
    setElections(updated);
    localStorage.setItem('vortex_elections', JSON.stringify(updated));
    return newElection;
  };

  const updateElection = (id, updates) => {
    const updated = elections.map(e => e.id === id ? { ...e, ...updates } : e);
    setElections(updated);
    localStorage.setItem('vortex_elections', JSON.stringify(updated));
  };

  const deleteElection = (id) => {
    const updated = elections.filter(e => e.id !== id);
    setElections(updated);
    localStorage.setItem('vortex_elections', JSON.stringify(updated));
  };

  // Candidates
  const createCandidate = (candidateData) => {
    const newCandidate = {
      id: generateId(),
      ...candidateData,
      votes: 0
    };
    const updated = [...candidates, newCandidate];
    setCandidates(updated);
    localStorage.setItem('vortex_candidates', JSON.stringify(updated));
    return newCandidate;
  };

  const updateCandidate = (id, updates) => {
    const updated = candidates.map(c => c.id === id ? { ...c, ...updates } : c);
    setCandidates(updated);
    localStorage.setItem('vortex_candidates', JSON.stringify(updated));
  };

  const deleteCandidate = (id) => {
    const updated = candidates.filter(c => c.id !== id);
    setCandidates(updated);
    localStorage.setItem('vortex_candidates', JSON.stringify(updated));
  };

  const getCandidatesByElection = (electionId) => {
    return candidates.filter(c => c.electionId === electionId);
  };

  // Votes
  const submitVote = (userId, electionId, candidateId) => {
    // Check if user already voted
    const existingVote = votes.find(v => v.userId === userId && v.electionId === electionId);
    if (existingVote) {
      return { success: false, error: 'Already voted in this election' };
    }

    const receiptId = `VOTE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newVote = {
      id: generateId(),
      userId,
      electionId,
      candidateId,
      timestamp: new Date().toISOString(),
      receiptId
    };

    const updatedVotes = [...votes, newVote];
    setVotes(updatedVotes);
    localStorage.setItem('vortex_votes', JSON.stringify(updatedVotes));

    // Update candidate vote count
    const updatedCandidates = candidates.map(c => 
      c.id === candidateId ? { ...c, votes: (c.votes || 0) + 1 } : c
    );
    setCandidates(updatedCandidates);
    localStorage.setItem('vortex_candidates', JSON.stringify(updatedCandidates));

    // Update election voted count
    const updatedElections = elections.map(e => 
      e.id === electionId ? { ...e, votedCount: (e.votedCount || 0) + 1 } : e
    );
    setElections(updatedElections);
    localStorage.setItem('vortex_elections', JSON.stringify(updatedElections));

    return { success: true, vote: newVote };
  };

  const getUserVotes = (userId) => {
    return votes.filter(v => v.userId === userId);
  };

  const getVoteByReceipt = (receiptId) => {
    return votes.find(v => v.receiptId === receiptId);
  };

  const hasUserVoted = (userId, electionId) => {
    return votes.some(v => v.userId === userId && v.electionId === electionId);
  };

  // Pending Voters
  const approveVoter = (voterId) => {
    const updated = pendingVoters.filter(v => v.id !== voterId);
    setPendingVoters(updated);
    localStorage.setItem('vortex_pending_voters', JSON.stringify(updated));
  };

  const rejectVoter = (voterId) => {
    const updated = pendingVoters.filter(v => v.id !== voterId);
    setPendingVoters(updated);
    localStorage.setItem('vortex_pending_voters', JSON.stringify(updated));
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
    submitVote,
    getUserVotes,
    getVoteByReceipt,
    hasUserVoted,
    approveVoter,
    rejectVoter
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
