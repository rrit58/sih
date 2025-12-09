// Dummy data and helpers for role-based dashboard


// Demo users for each role
const demoUsers = {
  NGO: [
    {
      role: 'NGO',
      name: 'Ayush NGO',
      registrationId: 'NGO-2025-001',
      districtState: 'Lucknow, UP',
      lastLogin: '2025-11-23',
    },
    {
      role: 'NGO',
      name: 'Seva Foundation',
      registrationId: 'NGO-2025-002',
      districtState: 'Kanpur, UP',
      lastLogin: '2025-11-22',
    },
    {
      role: 'NGO',
      name: 'Green Earth Trust',
      registrationId: 'NGO-2025-003',
      districtState: 'Varanasi, UP',
      lastLogin: '2025-11-21',
    },
  ],
  School: [
    {
      role: 'School',
      name: 'ST Paul Academy',
      registrationId: 'SCH-2025-001',
      districtState: 'Lucknow, UP',
      lastLogin: '2025-11-23',
    },
    {
      role: 'School',
      name: 'Sunrise Public School',
      registrationId: 'SCH-2025-002',
      districtState: 'Kanpur, UP',
      lastLogin: '2025-11-22',
    },
    {
      role: 'School',
      name: 'City Model School',
      registrationId: 'SCH-2025-003',
      districtState: 'Varanasi, UP',
      lastLogin: '2025-11-21',
    },
  ],
  Panchayat: [
    {
      role: 'Panchayat',
      name: 'Rampur Panchayat',
      registrationId: 'GPO-2025-001',
      districtState: 'Lucknow, UP',
      lastLogin: '2025-11-23',
    },
    {
      role: 'Panchayat',
      name: 'Shivpur Gram Panchayat',
      registrationId: 'GPO-2025-002',
      districtState: 'Kanpur, UP',
      lastLogin: '2025-11-22',
    },
    {
      role: 'Panchayat',
      name: 'Bhagwanpur Panchayat',
      registrationId: 'GPO-2025-003',
      districtState: 'Varanasi, UP',
      lastLogin: '2025-11-21',
    },
  ],
};

const defaultUser = demoUsers.NGO[0];

const campaigns = [
  // NGO campaigns
  {
    id: 1,
    title: 'Clean Water Drive',
    description: 'Awareness campaign for clean water.',
    images: [],
    video: null,
    status: 'Approved',
    date: '2025-11-20',
    role: 'NGO',
    organizationName: 'Ayush NGO',
    volunteersCount: 12,
  },
  {
    id: 2,
    title: 'Tree Plantation',
    description: 'Planting 500 trees in Kanpur.',
    images: [],
    video: null,
    status: 'Pending',
    date: '2025-11-19',
    role: 'NGO',
    organizationName: 'Seva Foundation',
    volunteersCount: 20,
  },
  {
    id: 3,
    title: 'Plastic Free Varanasi',
    description: 'Campaign to reduce plastic use.',
    images: [],
    video: null,
    status: 'Approved',
    date: '2025-11-18',
    role: 'NGO',
    organizationName: 'Green Earth Trust',
    volunteersCount: 15,
  },
  // School campaigns
  {
    id: 4,
    title: 'Scholarship Info',
    description: 'Session on new scholarships.',
    images: [],
    video: null,
    status: 'Pending',
    date: '2025-11-18',
    role: 'School',
    schoolName: 'ST Paul Academy',
    principalName: 'Dr. Sharma',
    studentCount: 350,
  },
  {
    id: 5,
    title: 'Science Fair',
    description: 'Annual science exhibition.',
    images: [],
    video: null,
    status: 'Approved',
    date: '2025-11-17',
    role: 'School',
    schoolName: 'Sunrise Public School',
    principalName: 'Mrs. Verma',
    studentCount: 420,
  },
  {
    id: 6,
    title: 'Sports Day',
    description: 'Inter-school sports competition.',
    images: [],
    video: null,
    status: 'Approved',
    date: '2025-11-16',
    role: 'School',
    schoolName: 'City Model School',
    principalName: 'Mr. Singh',
    studentCount: 300,
  },
  // Panchayat campaigns
  {
    id: 7,
    title: 'Sanitation Awareness',
    description: 'Ward-level sanitation drive.',
    images: [],
    video: null,
    status: 'Approved',
    date: '2025-11-17',
    role: 'Panchayat',
    panchayatName: 'Rampur Panchayat',
    wardNumber: '5',
  },
  {
    id: 8,
    title: 'Water Conservation',
    description: 'Workshop on water saving.',
    images: [],
    video: null,
    status: 'Pending',
    date: '2025-11-16',
    role: 'Panchayat',
    panchayatName: 'Shivpur Gram Panchayat',
    wardNumber: '2',
  },
  {
    id: 9,
    title: 'Health Camp',
    description: 'Free health checkup for villagers.',
    images: [],
    video: null,
    status: 'Approved',
    date: '2025-11-15',
    role: 'Panchayat',
    panchayatName: 'Bhagwanpur Panchayat',
    wardNumber: '7',
  },
];

function getStats(role, campaigns) {
  const filtered = campaigns.filter(c => c.role === role);
  return [
    { label: 'Total Campaigns', value: filtered.length, icon: '📢' },
    { label: 'Approved Campaigns', value: filtered.filter(c => c.status === 'Approved').length, icon: '✅' },
    { label: 'Pending Campaigns', value: filtered.filter(c => c.status === 'Pending').length, icon: '⏳' },
    { label: 'Images/Video Uploaded', value: filtered.reduce((acc, c) => acc + (c.images?.length || 0) + (c.video ? 1 : 0), 0), icon: '🖼️' },
  ];
}

function getProfile(role, user, campaigns) {
  const filtered = campaigns.filter(c => c.role === role);
  return {
    name: user.name,
    role: role,
    registrationId: user.registrationId,
    districtState: user.districtState,
    lastLogin: user.lastLogin,
    totalCampaigns: filtered.length,
  };
}

function getFormFields(role) {
  const common = [
    { name: 'title', label: 'Title', required: true },
    { name: 'description', label: 'Description', required: true },
    { name: 'category', label: 'Category', required: true },
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'location', label: 'Location', required: true },
  ];
  if (role === 'NGO') {
    return [
      { name: 'organizationName', label: 'Organization Name', required: true },
      { name: 'volunteersCount', label: 'Volunteers Count', required: true, type: 'number' },
      ...common,
    ];
  }
  if (role === 'School') {
    return [
      { name: 'schoolName', label: 'School Name', required: true },
      { name: 'principalName', label: 'Principal Name', required: true },
      { name: 'studentCount', label: 'Student Count', required: true, type: 'number' },
      ...common,
    ];
  }
  if (role === 'Panchayat') {
    return [
      { name: 'panchayatName', label: 'Panchayat Name', required: true },
      { name: 'wardNumber', label: 'Ward Number', required: true },
      ...common,
    ];
  }
  return common;
}

export default {
  defaultUser,
  demoUsers,
  campaigns,
  getStats,
  getProfile,
  getFormFields,
};
