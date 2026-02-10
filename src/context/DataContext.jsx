import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { candidateAPI, electionAPI, resultAPI, voteAPI } from '../services/api';

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
  const [candidatesByElection, setCandidatesByElection] = useState({});
  const [hasVotedMap, setHasVotedMap] = useState({});
  const [lastReceipt, setLastReceipt] = useState(() => {
    const stored = localStorage.getItem('vortex_last_receipt');
    return stored ? JSON.parse(stored) : null;
  });

  const normalizeElection = (election) => ({
    id: election.electionId || election.id,
    name: election.name,
    description: election.description,
    status: election.status,
    startTime: election.startTime,
    endTime: election.endTime,
    totalVotes: election.totalVotes || 0,
    suspended: election.suspended || false,
  });

  const loadElections = useCallback(async () => {
    const data = await electionAPI.getAll();
    const normalized = Array.isArray(data) ? data.map(normalizeElection) : data.elections?.map(normalizeElection) || [];
    setElections(normalized);
    return normalized;
  }, []);

  useEffect(() => {
    loadElections().catch(() => setElections([]));
  }, [loadElections]);

  const createElection = async (electionData) => {
    const payload = {
      name: electionData.name,
      description: electionData.description,
      startTime: electionData.startTime,
      endTime: electionData.endTime,
    };
    const created = await electionAPI.create(payload);
    await loadElections();
    return created;
  };

  const startElection = async (electionId) => {
    const result = await electionAPI.start(electionId);
    await loadElections();
    return result;
  };

  const closeElection = async (electionId) => {
    const result = await electionAPI.close(electionId);
    await loadElections();
    return result;
  };

  const suspendElection = async (electionId, reason) => {
    const result = await electionAPI.suspend(electionId, reason);
    await loadElections();
    return result;
  };

  const resumeElection = async (electionId) => {
    const result = await electionAPI.resume(electionId);
    await loadElections();
    return result;
  };

  const amendElection = async (electionId, field, value, reason) => {
    const result = await electionAPI.update(electionId, { field, value, reason });
    await loadElections();
    return result;
  };

  const getCandidatesByElection = async (electionId) => {
    if (candidatesByElection[electionId]) {
      return candidatesByElection[electionId];
    }
    const candidates = await candidateAPI.getByElection(electionId);
    const formatted = Array.isArray(candidates) ? candidates : [];
    setCandidatesByElection((prev) => ({ ...prev, [electionId]: formatted }));
    return formatted;
  };

  const createCandidate = async (candidateData) => {
    const payload = {
      candidateId: candidateData.candidateId,
      name: candidateData.name,
      party: candidateData.party,
    };
    const result = await candidateAPI.create(candidateData.electionId, payload);
    setCandidatesByElection((prev) => ({
      ...prev,
      [candidateData.electionId]: undefined,
    }));
    await getCandidatesByElection(candidateData.electionId);
    return result;
  };

  const submitVote = async (electionId, candidateId) => {
    const response = await voteAPI.submit(electionId, candidateId);
    const receipt = response.receipt || response;
    setLastReceipt(receipt);
    localStorage.setItem('vortex_last_receipt', JSON.stringify(receipt));
    return receipt;
  };

  const verifyReceipt = async (receiptId) => {
    const response = await voteAPI.verifyReceipt(receiptId);
    return response.receipt || response;
  };

  const hasUserVoted = async (electionId) => {
    const response = await voteAPI.hasVoted(electionId);
    const result = Boolean(response?.hasVoted);
    setHasVotedMap((prev) => ({ ...prev, [electionId]: result }));
    return result;
  };

  const getResults = async (electionId) => {
    return resultAPI.getByElection(electionId);
  };

  const value = {
    elections,
    candidatesByElection,
    lastReceipt,
    hasVotedMap,
    createElection,
    startElection,
    closeElection,
    suspendElection,
    resumeElection,
    amendElection,
    createCandidate,
    getCandidatesByElection,
    submitVote,
    verifyReceipt,
    hasUserVoted,
    getResults
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
