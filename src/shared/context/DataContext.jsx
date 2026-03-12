import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { electionAPI, candidateAPI, voteAPI } from '../services/api';
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
  const [auditLogs, setAuditLogs] = useState([]);

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

  // Load data from API and localStorage on mount
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
        const loadedElections = JSON.parse(localStorage.getItem('vortex_elections') || '[]');
        setElections(loadedElections);
      }

      const loadedCandidates = JSON.parse(localStorage.getItem('vortex_candidates') || '[]');
      const loadedVotes = JSON.parse(localStorage.getItem('vortex_votes') || '[]');
      const loadedPending = JSON.parse(localStorage.getItem('vortex_pending_voters') || '[]');
      const loadedAuditLogs = JSON.parse(localStorage.getItem('vortex_audit_logs') || '[]');

      setCandidates(loadedCandidates);
      setVotes(loadedVotes);
      setPendingVoters(loadedPending);
      setAuditLogs(loadedAuditLogs);
    };

    loadInitial();
  }, []);

  useEffect(() => {
    console.log('DataContext State Update: elections=', elections.map(e => ({ id: e.id, title: e.title })));
    console.log('DataContext State Update: candidates=', candidates.map(c => ({ id: c.id, electionId: c.electionId, name: c.name })));
  }, [elections, candidates]);

  const addAuditLog = (action, entityId, details, actor) => {
    const newLog = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      action,
      entityId,
      details,
      actor
    };
    const updated = [newLog, ...auditLogs]; // Add to beginning
    setAuditLogs(updated);
    localStorage.setItem('vortex_audit_logs', JSON.stringify(updated));
  };

  // Elections
  const createElection = async (electionData) => {
    // Build a local mock object that looks like what the API would return
    const mockCreated = {
      electionId: electionData.id || `election-${Date.now()}`,
      name: electionData.title,
      description: electionData.description,
      startTime: electionData.startDate,
      endTime: electionData.endDate,
      status: 'pending',
      totalVoters: electionData.totalVoters || 0,
      votedCount: 0,
    };

    try {
      const payload = {
        electionId: mockCreated.electionId,
        name: mockCreated.name,
        description: mockCreated.description,
        startTime: mockCreated.startTime,
        endTime: mockCreated.endTime,
      };
      const created = await electionAPI.create(payload);
      const normalized = normalizeElection(created);
      setElections((prev) => {
        const updated = [...prev, normalized];
        localStorage.setItem('vortex_elections', JSON.stringify(updated));
        return updated;
      });
      addAuditLog('ELECTION_CREATED', normalized.id, `Created election: ${normalized.title}`, 'Admin');
      return normalized;
    } catch (error) {
      // ==== MOCK DATA FALLBACK ====
      const normalized = normalizeElection(mockCreated);
      setElections((prev) => {
        const updated = [...prev, normalized];
        localStorage.setItem('vortex_elections', JSON.stringify(updated));
        return updated;
      });
      addAuditLog('ELECTION_CREATED', normalized.id, `Created election: ${normalized.title}`, 'Admin');
      return normalized;
    }
  };

  const updateElection = (id, updates) => {
    setElections((prev) => {
      const updated = prev.map(e => e.id === id ? { ...e, ...updates } : e);
      localStorage.setItem('vortex_elections', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('ELECTION_UPDATED', id, `Updated election settings for protocol ID: ${id}`, 'Admin');
  };

  const deleteElection = async (id) => {
    try {
      await electionAPI.delete(id);
    } catch (error) {
      // ==== MOCK DATA FALLBACK: proceed locally even if API fails ====
      console.warn('Delete election API unavailable, removing locally.');
    }
    setElections((prev) => {
      const updated = prev.filter(e => e.id !== id);
      localStorage.setItem('vortex_elections', JSON.stringify(updated));
      return updated;
    });
  };

  // Candidates
  const createCandidate = async (candidateData) => {
    const candidateId = candidateData.id || `candidate-${Date.now()}`;
    const payload = {
      candidateId,
      name: candidateData.name,
      party: candidateData.role,
    };

    try {
      const created = await candidateAPI.create(candidateData.electionId, payload);
      const normalized = normalizeCandidate({ ...created, electionId: candidateData.electionId });
      setCandidates((prev) => {
        const updated = [...prev, normalized];
        console.log('DataContext: Candidate created, new total:', updated.length);
        localStorage.setItem('vortex_candidates', JSON.stringify(updated));
        return updated;
      });
      return normalized;
    } catch (error) {
      console.warn('DataContext: Create candidate API failed, using fallback', error);
      // ==== MOCK DATA FALLBACK ====
      const normalized = normalizeCandidate({
        candidateId,
        name: candidateData.name,
        party: candidateData.role,
        bio: candidateData.bio || '',
        photo: candidateData.photo || '',
        electionId: candidateData.electionId,
      });
      setCandidates((prev) => {
        const updated = [...prev, normalized];
        console.log('DataContext: Candidate created (fallback), new total:', updated.length);
        localStorage.setItem('vortex_candidates', JSON.stringify(updated));
        return updated;
      });
      return normalized;
    }
  };

  const updateCandidate = (id, updates) => {
    setCandidates((prev) => {
      const updated = prev.map(c => c.id === id ? { ...c, ...updates } : c);
      localStorage.setItem('vortex_candidates', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteCandidate = (id) => {
    setCandidates((prev) => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem('vortex_candidates', JSON.stringify(updated));
      return updated;
    });
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

      if (normalized.length === 0) {
        console.log(`DataContext: No candidates found on server for election ${electionId}, keeping local ones.`);
        return;
      }

      setCandidates((prev) => {
        // Merge strategy: Keep local ones for other elections, 
        // and for THIS election, prefer API results but keep anything that might be strictly local
        const otherElections = prev.filter(c => c.electionId !== electionId);
        const localForThisElection = prev.filter(c => c.electionId === electionId);
        
        // Only replace if we got something new. If we already have local ones, 
        // we might want to keep them if the API returned an empty list (already handled above)
        // For now, let's just merge to be safe
        const mergedForThisElection = [...normalized];
        // Add local ones that aren't in the normalized list (by ID)
        localForThisElection.forEach(local => {
          if (!mergedForThisElection.some(n => n.id === local.id)) {
            mergedForThisElection.push(local);
          }
        });

        const updated = [...otherElections, ...mergedForThisElection];
        console.log(`DataContext: Candidates updated for ${electionId}, merged total:`, mergedForThisElection.length);
        localStorage.setItem('vortex_candidates', JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.warn(`DataContext: Failed to load candidates from API for ${electionId}`, error);
      // On error, we keep the candidates already in state/localStorage
    }
  }, []);

  // Votes
  const submitVote = async (userId, electionId, candidateId) => {
    const existingVote = votes.find(v => v.userId === userId && v.electionId === electionId);
    if (existingVote) {
      return { success: false, error: 'Already voted in this election' };
    }

    let receiptId = '';
    try {
      const result = await voteAPI.cast(electionId, candidateId);
      receiptId =
        result?.receipt?.receiptId ||
        result?.receipt?.ReceiptID ||
        result?.receipt ||
        `receipt-${Date.now()}`;
    } catch (error) {
      // ==== MOCK DATA FALLBACK: generate local receipt ====
      receiptId = `MOCK-${Date.now().toString(36).toUpperCase()}`;
    }

    const newVote = {
      id: `vote-${Date.now()}`,
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
    addAuditLog('VOTE_CAST', electionId, `Vote successfully cast. Receipt: ${receiptId}`, 'System');

    return { success: true, vote: newVote };
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

  const getAllVotes = () => {
    return votes;
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
    auditLogs,
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
    getAllVotes,
    getVoteByReceipt,
    hasUserVoted,
    approveVoter,
    rejectVoter,
    addAuditLog
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
