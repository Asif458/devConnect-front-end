import { Home, Search, CalendarPlus, CalendarCheck, MessageSquare, Users, User } from "lucide-react";

// --- THEME CONSTANTS ---
export const PRIMARY_COLOR = '#032f60'; // Dark Blue
export const ACCENT_COLOR = '#FFC107'; // Gold/Premium

 

export const sidebarItems = [
  { name: "Home / Feed", slug: "feed" },
  { name: "Find Mentors/Developers", slug: "find" },
  { name: "Book Mentorship", slug: "book" },
  { name: "My Bookings", slug: "bookings" },
  { name: "Messages", slug: "messages" },
  { name: "Groups", slug: "groups" },
  { name: "Profile", slug: "profile" },
];

export const mentorSidebarItems = [
  { name: "Dashboard", slug: "dashboard" },
  { name: "Connection Requests", slug: "requests" },
  { name: "My Students", slug: "students" },
  { name: "Sessions", slug: "sessions" },
  { name: "Messages", slug: "messages" },
  { name: "Profile", slug: "profile" },
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
