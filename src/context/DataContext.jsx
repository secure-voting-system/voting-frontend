import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL, candidatesAPI, electionsAPI, resultsAPI, votesAPI } from '../services/api';

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
  const [sseConnected, setSseConnected] = useState(false);
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
    const data = await electionsAPI.list();
    const normalized = Array.isArray(data) ? data.map(normalizeElection) : data.elections?.map(normalizeElection) || [];
    setElections(normalized);
    return normalized;
  }, []);

  useEffect(() => {
    loadElections().catch(() => setElections([]));
  }, [loadElections]);

  useEffect(() => {
    const baseUrl = API_BASE_URL.replace(/\/api$/, '');
    const eventsUrl = `${baseUrl}/api/events`;
    const eventSource = new EventSource(eventsUrl);

    eventSource.onopen = () => {
      setSseConnected(true);
    };

    const handleElectionUpdate = (electionId, updates) => {
      setElections((prev) =>
        prev.map((election) =>
          election.id === electionId ? { ...election, ...updates } : election
        )
      );
    };

    eventSource.addEventListener('ElectionCreated', (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (!payload?.electionId) {
          return;
        }
        setElections((prev) => {
          const exists = prev.some((election) => election.id === payload.electionId);
          if (exists) {
            return prev;
          }
          return [
            {
              id: payload.electionId,
              name: payload.name || 'New Election',
              description: payload.description || '',
              status: payload.status || 'pending',
              startTime: payload.startTime || 0,
              endTime: payload.endTime || 0,
              totalVotes: 0,
              suspended: false,
            },
            ...prev,
          ];
        });
      } catch (error) {
        // ignore parsing errors
      }
    });

    eventSource.addEventListener('ElectionStarted', (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload?.electionId) {
          handleElectionUpdate(payload.electionId, { status: 'active' });
        }
      } catch (error) {
        // ignore parsing errors
      }
    });

    eventSource.addEventListener('ElectionEnded', (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload?.electionId) {
          handleElectionUpdate(payload.electionId, {
            status: 'closed',
            totalVotes: payload.totalVotes ?? 0,
          });
        }
      } catch (error) {
        // ignore parsing errors
      }
    });

    eventSource.addEventListener('ElectionSuspended', (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload?.electionId) {
          handleElectionUpdate(payload.electionId, { status: 'suspended', suspended: true });
        }
      } catch (error) {
        // ignore parsing errors
      }
    });

    eventSource.addEventListener('ElectionResumed', (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload?.electionId) {
          handleElectionUpdate(payload.electionId, { status: 'active', suspended: false });
        }
      } catch (error) {
        // ignore parsing errors
      }
    });

    eventSource.addEventListener('VoteCast', (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload?.electionId) {
          setElections((prev) =>
            prev.map((election) =>
              election.id === payload.electionId
                ? { ...election, totalVotes: (election.totalVotes || 0) + 1 }
                : election
            )
          );
        }
      } catch (error) {
        // ignore parsing errors
      }
    });

    eventSource.addEventListener('error', () => {
      setSseConnected(false);
      eventSource.close();
    });

    return () => {
      setSseConnected(false);
      eventSource.close();
    };
  }, []);

  const createElection = async (electionData) => {
    const payload = {
      name: electionData.name,
      description: electionData.description,
      startTime: electionData.startTime,
      endTime: electionData.endTime,
    };
    const created = await electionsAPI.create(payload);
    await loadElections();
    return created;
  };

  const startElection = async (electionId) => {
    const result = await electionsAPI.start(electionId);
    await loadElections();
    return result;
  };

  const closeElection = async (electionId) => {
    const result = await electionsAPI.close(electionId);
    await loadElections();
    return result;
  };

  const suspendElection = async (electionId, reason) => {
    const result = await electionsAPI.suspend(electionId, reason);
    await loadElections();
    return result;
  };

  const resumeElection = async (electionId) => {
    const result = await electionsAPI.resume(electionId);
    await loadElections();
    return result;
  };

  const amendElection = async (electionId, field, value, reason) => {
    const result = await electionsAPI.update(electionId, { field, value, reason });
    await loadElections();
    return result;
  };

  const getCandidatesByElection = async (electionId) => {
    if (candidatesByElection[electionId]) {
      return candidatesByElection[electionId];
    }
    const candidates = await candidatesAPI.list(electionId);
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
    const result = await candidatesAPI.create(candidateData.electionId, payload);
    setCandidatesByElection((prev) => ({
      ...prev,
      [candidateData.electionId]: undefined,
    }));
    await getCandidatesByElection(candidateData.electionId);
    return result;
  };

  const submitVote = async (electionId, candidateId) => {
    const response = await votesAPI.cast({ electionId, candidateId });
    const receipt = response.receipt || response;
    setLastReceipt(receipt);
    localStorage.setItem('vortex_last_receipt', JSON.stringify(receipt));
    return receipt;
  };

  const verifyReceipt = async (receiptId) => {
    const response = await votesAPI.verify(receiptId);
    return response.receipt || response;
  };

  const hasUserVoted = async (electionId) => {
    const response = await votesAPI.status(electionId);
    const result = Boolean(response?.hasVoted);
    setHasVotedMap((prev) => ({ ...prev, [electionId]: result }));
    return result;
  };

  const getResults = async (electionId) => {
    return resultsAPI.byElection(electionId);
  };

  const value = {
    elections,
    candidatesByElection,
    lastReceipt,
    hasVotedMap,
    sseConnected,
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
