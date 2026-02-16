// Mock UUID generator (simple version without external dependency)
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const mockUsers = [
  {
    id: 'user-1',
    email: 'admin@vortex.com',
    password: 'admin123', // In real app, this would be hashed
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: 'user-2',
    email: 'voter@vortex.com',
    password: 'voter123',
    role: 'voter',
    name: 'John Doe'
  }
];

const getRelativeDate = (daysOffset) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString();
};

export const mockElections = [
  {
    id: 'election-1',
    title: 'Student Council 2026',
    description: 'Annual student council election for academic year 2026-2027',
    status: 'active',
    startDate: getRelativeDate(-2), // Started 2 days ago
    endDate: getRelativeDate(5),    // Ends in 5 days
    totalVoters: 1250,
    votedCount: 1155
  },
  {
    id: 'election-2',
    title: 'Department Representatives',
    description: 'Election for department-level student representatives',
    status: 'pending',
    startDate: getRelativeDate(10), // Starts in 10 days
    endDate: getRelativeDate(15),   // Ends in 15 days
    totalVoters: 850,
    votedCount: 0
  },
  {
    id: 'election-3',
    title: 'Sports Committee 2025',
    description: 'Selection of sports committee members',
    status: 'closed',
    startDate: getRelativeDate(-30), // Started 30 days ago
    endDate: getRelativeDate(-25),   // Ended 25 days ago
    totalVoters: 600,
    votedCount: 542
  }
];

export const mockCandidates = [
  {
    id: 'candidate-1',
    electionId: 'election-1',
    name: 'Sarah Johnson',
    role: 'Executive Lead Candidate',
    bio: 'Experienced leader with 3 years in student governance',
    photo: null,
    votes: 450
  },
  {
    id: 'candidate-2',
    electionId: 'election-1',
    name: 'Marcus Chen', // Removed invalid emoji characters
    role: 'Regional Strategy Head',
    bio: 'Focused on improving campus infrastructure',
    photo: null,
    votes: 380
  },
  {
    id: 'candidate-3',
    electionId: 'election-1',
    name: 'Elena Rodriguez',
    role: 'Global Operations',
    bio: 'Passionate about international student programs',
    photo: null,
    votes: 325
  },
  {
    id: 'candidate-4',
    electionId: 'election-2',
    name: 'David Kim',
    role: 'CS Department Rep',
    bio: 'Computer Science senior with strong technical background',
    photo: null,
    votes: 0
  }
];

export const mockVotes = [];

export const mockPendingVoters = [
  {
    id: 'pending-1',
    name: 'Adrian Sterling',
    info: 'North Sector • V-8842',
    security: 'High Confidence',
    status: 'pending'
  },
  {
    id: 'pending-2',
    name: 'Bianca Vance',
    info: 'West Wing • V-7712',
    security: 'Standard',
    status: 'pending'
  },
  {
    id: 'pending-3',
    name: 'Cassian Thorne',
    info: 'Global • V-3390',
    security: 'Pending Review',
    status: 'pending'
  }
];

// Initialize localStorage with mock data
export const initializeMockData = () => {
  const DATA_VERSION = 'v2-2026-fix';
  const currentVersion = localStorage.getItem('vortex_data_version');

  // Force reset if version mismatch
  if (currentVersion !== DATA_VERSION) {
    localStorage.clear();
    localStorage.setItem('vortex_data_version', DATA_VERSION);
    
    // Re-initialize all data
    localStorage.setItem('vortex_users', JSON.stringify(mockUsers));
    localStorage.setItem('vortex_elections', JSON.stringify(mockElections));
    localStorage.setItem('vortex_candidates', JSON.stringify(mockCandidates));
    localStorage.setItem('vortex_votes', JSON.stringify(mockVotes));
    localStorage.setItem('vortex_pending_voters', JSON.stringify(mockPendingVoters));
    
    // Keep user logged in if possible (optional, but clearing everything is safer for consistency)
    // console.log('Mock data refreshed to version:', DATA_VERSION);
    return;
  }

  // Standard check (fallback)
  if (!localStorage.getItem('vortex_users')) {
    localStorage.setItem('vortex_users', JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem('vortex_elections')) {
    localStorage.setItem('vortex_elections', JSON.stringify(mockElections));
  }
  if (!localStorage.getItem('vortex_candidates')) {
    localStorage.setItem('vortex_candidates', JSON.stringify(mockCandidates));
  }
  if (!localStorage.getItem('vortex_votes')) {
    localStorage.setItem('vortex_votes', JSON.stringify(mockVotes));
  }
  if (!localStorage.getItem('vortex_pending_voters')) {
    localStorage.setItem('vortex_pending_voters', JSON.stringify(mockPendingVoters));
  }
};

export { generateId };
