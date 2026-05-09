import type { InstructorState, CourseDraft, PayoutEntry } from '../types/instructor';

const DAY = 86_400_000;
function ago(days: number): string { return new Date(Date.now() - days * DAY).toISOString(); }
function isoDay(daysAgo: number): string { return new Date(Date.now() - daysAgo * DAY).toISOString().split('T')[0]; }
function monthLabel(monthsAgo: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  return d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
}

const reactDraft: CourseDraft = {
  id: 'inst-c1',
  status: 'published',
  title: 'Complete React Developer in 2024',
  subtitle: 'Master modern React with hooks, TypeScript, performance optimisation, and production patterns.',
  thumbnail: 'https://picsum.photos/seed/react2024/480/270',
  category: 'Web Development',
  level: 'intermediate',
  language: 'English',
  whatYouLearn: [
    'Build production-grade React applications from scratch',
    'Master every built-in hook and write your own',
    'Manage state with Context, useReducer, and Zustand',
    'Optimise rendering with memoisation and virtualisation',
    'Use TypeScript effectively in React projects',
  ],
  requirements: [
    'Working knowledge of HTML, CSS, and modern JavaScript',
    'Node.js 18+ installed locally',
    'No prior React experience required',
  ],
  longDescription: 'Welcome to the most comprehensive React course on the platform.\n\nWhether you have written a few components or you are completely new to the framework, this course will take you from the fundamentals to advanced production patterns.',
  price: 89.99,
  enrollments: 12_430,
  rating: 4.7,
  reviewCount: 2_440,
  revenueLifetime: 184_320,
  sections: [
    { id: 's1', title: 'Getting Started', lectures: [
      { id: 'l1', title: 'Course Overview', description: 'A bird\'s-eye view of what we\'ll build.', videoUrl: '/videos/sample.mp4', durationSeconds: 596, isFreePreview: true },
      { id: 'l2', title: 'Setting Up Your Environment', description: 'Node, VS Code, and the essentials.', videoUrl: '/videos/sample.mp4', durationSeconds: 596, isFreePreview: false },
    ]},
    { id: 's2', title: 'React Fundamentals', lectures: [
      { id: 'l3', title: 'JSX Deep Dive', description: 'How JSX compiles and best practices.', videoUrl: '/videos/sample.mp4', durationSeconds: 596, isFreePreview: false },
      { id: 'l4', title: 'Props and State', description: 'Data flow and lifting state up.', videoUrl: '/videos/sample.mp4', durationSeconds: 596, isFreePreview: false },
    ]},
  ],
  publishedAt: ago(180),
  lastUpdatedAt: ago(20),
};

const draftCourse: CourseDraft = {
  id: 'inst-c2',
  status: 'draft',
  title: 'Building Component Libraries',
  subtitle: 'Design tokens, polymorphic components, and shipping a v1.0.',
  category: 'Web Development',
  level: 'advanced',
  language: 'English',
  whatYouLearn: ['Design tokens', 'Polymorphic API design', 'Versioning'],
  requirements: ['Comfortable with React + TypeScript'],
  longDescription: 'Outline only — needs work.',
  price: 0,
  enrollments: 0,
  rating: 0,
  reviewCount: 0,
  revenueLifetime: 0,
  sections: [
    { id: 's1', title: 'Foundations', lectures: [
      { id: 'l1', title: 'Why component libraries?', description: '', isFreePreview: false },
    ]},
  ],
  lastUpdatedAt: ago(2),
};

const archivedCourse: CourseDraft = {
  id: 'inst-c3',
  status: 'archived',
  title: 'React Class Components (legacy)',
  subtitle: 'Archived — covers pre-hooks React patterns.',
  thumbnail: 'https://picsum.photos/seed/legacy/480/270',
  category: 'Web Development',
  level: 'beginner',
  language: 'English',
  whatYouLearn: ['Lifecycle methods', 'this.setState'],
  requirements: ['JavaScript familiarity'],
  longDescription: 'Archived as of last year. Kept for legacy references.',
  price: 49.99,
  enrollments: 8_900,
  rating: 4.4,
  reviewCount: 1_280,
  revenueLifetime: 41_200,
  sections: [],
  publishedAt: ago(900),
  lastUpdatedAt: ago(400),
};

const enrollmentsLast30 = Array.from({ length: 30 }, (_, i) => ({
  date: isoDay(29 - i),
  count: 8 + Math.floor(Math.abs(Math.sin(i * 0.6)) * 28),
}));

const revenueLast12Months = Array.from({ length: 12 }, (_, i) => ({
  month: monthLabel(11 - i),
  amount: 8_400 + Math.floor(Math.abs(Math.cos(i * 0.5)) * 7_200),
}));

const payouts: PayoutEntry[] = [
  { id: 'po1', amount: 14_320, paidAt: ago(15),  method: 'stripe' },
  { id: 'po2', amount: 11_980, paidAt: ago(45),  method: 'stripe' },
  { id: 'po3', amount: 9_640,  paidAt: ago(75),  method: 'stripe' },
  { id: 'po4', amount: 12_510, paidAt: ago(105), method: 'paypal' },
  { id: 'po5', amount: 10_870, paidAt: ago(135), method: 'stripe' },
];

export const initialInstructorState: InstructorState = {
  drafts: [reactDraft, draftCourse, archivedCourse],
  stats: {
    totalStudents: 184_500,
    monthlyRevenue: 14_320,
    lifetimeRevenue: 245_320,
    pendingPayout: 6_240,
    avgRating: 4.7,
    unansweredQuestions: 9,
    enrollmentsLast30,
    revenueLast12Months,
  },
  payouts,
};
