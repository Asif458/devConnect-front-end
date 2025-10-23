import { Home, Users, BookOpen, Clock, Mail, LayoutGrid, User } from 'lucide-react';

// --- THEME CONSTANTS ---
export const PRIMARY_COLOR = '#043873'; // Dark Blue
export const ACCENT_COLOR = '#FFC107'; // Gold/Premium

// --- SIDEBAR NAVIGATION DATA ---
export const sidebarItems = [
  // The 'slug' is used for internal mapping and setting the active state
  { id: 1, slug: 'feed', name: 'Home / Feed', icon: Home, isActive: true },
  { id: 2, slug: 'find', name: 'Find Mentors / Users', icon: Users, isActive: false },
  { id: 3, slug: 'book', name: 'Book Mentorship', icon: BookOpen, isActive: false },
  { id: 4, slug: 'bookings', name: 'My Bookings', icon: Clock, isActive: false },
  { id: 5, slug: 'messages', name: 'Messages', icon: Mail, isActive: false },
  { id: 6, slug: 'groups', name: 'Groups', icon: LayoutGrid, isActive: false },
  { id: 7, slug: 'profile', name: 'Profile', icon: User, isActive: false },
];

// --- TAG COLOR UTILITY ---
const TAG_COLORS = [
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-yellow-100 text-yellow-800 border-yellow-200',
  'bg-green-100 text-green-800 border-green-200',
  'bg-red-100 text-red-800 border-red-200',
  'bg-purple-100 text-purple-800 border-purple-200',
  'bg-sky-100 text-sky-800 border-sky-200',
];

export const getTagColor = (index) => {
  return TAG_COLORS[index % TAG_COLORS.length];
};


// --- MOCK POST DATA ---
export const mockPosts = [
  {
    id: 1,
    name: 'Sarah Chen',
    title: 'Senior React Developer',
    avatarInitials: 'SC',
    timeAgo: '2 hours ago',
    skills: ['React', 'TypeScript', 'Redux'],
    content: "Just finished implementing a complex state management solution using Redux Toolkit and immutable updates. The performance improvements are incredible! Happy to share insights with anyone working on similar challenges.",
    imageUrl: 'https://placehold.co/800x400/1e293b/cbd5e1?text=Code+Snippet+Visualization',
    likes: 24,
    comments: 8,
    shares: 3,
  },
  {
    id: 2,
    name: 'Michael Davis',
    title: 'DevOps Engineer',
    avatarInitials: 'MD',
    timeAgo: 'Yesterday',
    skills: ['Kubernetes', 'AWS', 'Terraform'],
    content: "My team successfully migrated our main microservice to Kubernetes. Took three weeks of planning, but the auto-scaling capabilities are a huge win. Never underestimate the power of a clean Terraform config!",
    imageUrl: null,
    likes: 157,
    comments: 41,
    shares: 12,
  },
  {
    id: 3,
    name: 'Aisha Khan',
    title: 'Data Scientist',
    avatarInitials: 'AK',
    timeAgo: '3 days ago',
    skills: ['Python', 'Pandas', 'Machine Learning'],
    content: "I wrote a quick article explaining how to efficiently clean messy datasets using Pandas vectorized operations instead of traditional loops. Link in my profile! It dramatically cuts down processing time.",
    imageUrl: 'https://placehold.co/800x400/004d40/ffffff?text=Data+Science+Graph',
    likes: 88,
    comments: 19,
    shares: 7,
  },
];
