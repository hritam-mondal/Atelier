import mockCourse from './mockCourse.json';
import type { CourseDetail, Review, FAQItem, RatingBreakdownItem } from '../types/courseDetail';
import type { Course } from '../types/course';

const baseCourse = mockCourse as Course;

const reviews: Review[] = [
  { id: 'r1',  userId: 'u101', userName: 'Daniel Reyes',    userAvatar: 'https://i.pravatar.cc/64?u=daniel',    rating: 5, date: '2025-02-10', title: 'Best React course I have ever taken', body: 'Sarah explains complex concepts with surgical clarity. The hooks chapter alone is worth the price — I finally understand the dependency array, the reconciliation rules, and why my old code kept re-rendering. Five months in, I have already shipped two production features at work using the patterns from sections 3 and 6.', helpfulCount: 184, isVerifiedPurchase: true },
  { id: 'r2',  userId: 'u102', userName: 'Aisha Khan',      userAvatar: 'https://i.pravatar.cc/64?u=aisha',     rating: 5, date: '2025-01-28', title: 'Exactly what I needed for my career switch', body: 'Coming from a Python backend background, the React mental model used to feel alien. By section 4 it clicked. The performance section is gold — I cut our dashboard render time in half using just the techniques here.', helpfulCount: 142, isVerifiedPurchase: true },
  { id: 'r3',  userId: 'u103', userName: 'Marco Bianchi',   userAvatar: 'https://i.pravatar.cc/64?u=marco',     rating: 4, date: '2025-01-15', title: 'Great content, pacing could be tighter', body: 'Content quality is excellent. My only nitpick is that some of the early lectures spend a long time on basics before moving on. If you have any prior React exposure, feel free to skip the first section at 1.5x.', helpfulCount: 96, isVerifiedPurchase: true },
  { id: 'r4',  userId: 'u104', userName: 'Priya Iyer',      userAvatar: 'https://i.pravatar.cc/64?u=priya2',    rating: 5, date: '2025-01-09', title: 'Worth every penny', body: 'I have purchased four React courses in the past two years. This is the only one I actually finished. The projects feel real, the code is modern, and the explanations never talk down to you.', helpfulCount: 211, isVerifiedPurchase: true },
  { id: 'r5',  userId: 'u105', userName: 'Tom O\'Brien',     userAvatar: 'https://i.pravatar.cc/64?u=tom2',      rating: 3, date: '2024-12-30', title: 'Good but a bit dated in places', body: 'Most of the material is current, but a couple of the sections still reference older patterns. Would be a 5-star course with a 2025 refresh on the data-fetching chapter.', helpfulCount: 54, isVerifiedPurchase: true },
  { id: 'r6',  userId: 'u106', userName: 'Hannah Müller',   userAvatar: 'https://i.pravatar.cc/64?u=hannah',    rating: 5, date: '2024-12-22', title: 'Clear, modern, production-ready', body: 'The Context API and state management section finally cleared up my confusion about when to reach for Zustand vs. just composing context. Sarah\'s opinions are well-reasoned and she shows you the trade-offs.', helpfulCount: 167, isVerifiedPurchase: true },
  { id: 'r7',  userId: 'u107', userName: 'Yuki Tanaka',     userAvatar: 'https://i.pravatar.cc/64?u=yuki',      rating: 5, date: '2024-12-10', title: 'Helped me pass my technical interviews', body: 'Three offers in five weeks after completing this. The advanced hooks and performance lectures gave me real talking points. Cannot recommend enough.', helpfulCount: 298, isVerifiedPurchase: true },
  { id: 'r8',  userId: 'u108', userName: 'Carlos Romero',   userAvatar: 'https://i.pravatar.cc/64?u=carlos2',   rating: 4, date: '2024-11-28', title: 'Solid for intermediate devs', body: 'If you already know JS and have built one or two small SPAs, this is the right level. Beginners might struggle a bit in the routing section.', helpfulCount: 78, isVerifiedPurchase: true },
  { id: 'r9',  userId: 'u109', userName: 'Sophie Laurent',  userAvatar: 'https://i.pravatar.cc/64?u=sophie2',   rating: 5, date: '2024-11-19', title: 'Production patterns I use every day', body: 'The custom hooks chapter alone has paid back my subscription fee many times over. Code organization tips at the end of section 3 transformed how I structure components.', helpfulCount: 134, isVerifiedPurchase: true },
  { id: 'r10', userId: 'u110', userName: 'Liam Walsh',      userAvatar: 'https://i.pravatar.cc/64?u=liam',      rating: 2, date: '2024-11-05', title: 'Audio quality drops in some chapters', body: 'Content is fine but the recording level is inconsistent. I had to keep adjusting volume between lectures, which kills the flow.', helpfulCount: 22, isVerifiedPurchase: false },
  { id: 'r11', userId: 'u111', userName: 'Nina Petrov',     userAvatar: 'https://i.pravatar.cc/64?u=nina2',     rating: 5, date: '2024-10-28', title: 'Five stars and then some', body: 'I have taught React internally at my company for two years and I still picked up new tricks here. The reconciliation explanation is the cleanest I have seen.', helpfulCount: 256, isVerifiedPurchase: true },
  { id: 'r12', userId: 'u112', userName: 'Ahmed Hassan',    userAvatar: 'https://i.pravatar.cc/64?u=ahmed',     rating: 4, date: '2024-10-14', title: 'Excellent depth on hooks', body: 'I wish there was a bonus chapter on testing, but everything that is here is taught at a very high level. The useReducer deep dive is fantastic.', helpfulCount: 88, isVerifiedPurchase: true },
  { id: 'r13', userId: 'u113', userName: 'Mei Lin',         userAvatar: 'https://i.pravatar.cc/64?u=mei2',      rating: 5, date: '2024-10-02', title: 'Best instructor I have learned from', body: 'Sarah has a knack for turning abstract concepts into concrete examples. Her diagrams in the rendering section made me finally understand React\'s commit phase.', helpfulCount: 192, isVerifiedPurchase: true },
  { id: 'r14', userId: 'u114', userName: 'Jake Patterson',  userAvatar: 'https://i.pravatar.cc/64?u=jake',      rating: 3, date: '2024-09-22', title: 'Good but assumes JS fundamentals', body: 'If you do not already know modern JS (destructuring, spread, async/await), you will be lost in the first hour. Brush up first, then come back.', helpfulCount: 41, isVerifiedPurchase: true },
  { id: 'r15', userId: 'u115', userName: 'Olivia Stone',    userAvatar: 'https://i.pravatar.cc/64?u=olivia',    rating: 5, date: '2024-09-10', title: 'Lifetime access is real value', body: 'I started this six months ago, took a break, came back, and the content was even better the second time through. The Q&A section is also surprisingly active.', helpfulCount: 119, isVerifiedPurchase: true },
  { id: 'r16', userId: 'u116', userName: 'Diego Fernández', userAvatar: 'https://i.pravatar.cc/64?u=diego',     rating: 4, date: '2024-08-28', title: 'Strong fundamentals, weaker on backend integration', body: 'The backend integration examples use a fake API. I would have liked a chapter on hooking React up to a real Express or Django service. Otherwise excellent.', helpfulCount: 67, isVerifiedPurchase: true },
  { id: 'r17', userId: 'u117', userName: 'Rachel Green',    userAvatar: 'https://i.pravatar.cc/64?u=rachelg',   rating: 5, date: '2024-08-15', title: 'Crystal clear explanations', body: 'No fluff. Every minute teaches you something concrete. I doubled my React productivity within two weeks of finishing this.', helpfulCount: 168, isVerifiedPurchase: true },
  { id: 'r18', userId: 'u118', userName: 'Felix Brandt',    userAvatar: 'https://i.pravatar.cc/64?u=felix',     rating: 1, date: '2024-08-01', title: 'Not for absolute beginners', body: 'Marketed as for all levels but I was lost within twenty minutes. Returned it within the refund window — at least the money-back guarantee works.', helpfulCount: 14, isVerifiedPurchase: true },
  { id: 'r19', userId: 'u119', userName: 'Anjali Desai',    userAvatar: 'https://i.pravatar.cc/64?u=anjali',    rating: 5, date: '2024-07-22', title: 'Career-defining course', body: 'I went from junior to senior front-end in eighteen months. A non-trivial portion of that growth came from this course. The advanced patterns and performance section gave me confidence to lead architectural discussions.', helpfulCount: 224, isVerifiedPurchase: true },
  { id: 'r20', userId: 'u120', userName: 'Owen Park',       userAvatar: 'https://i.pravatar.cc/64?u=owen',      rating: 4, date: '2024-07-09', title: 'Great content, would love more exercises', body: 'The lecture-to-exercise ratio could be a bit higher. I learn best by doing and the existing exercises were excellent — just want more of them.', helpfulCount: 73, isVerifiedPurchase: true },
  { id: 'r21', userId: 'u121', userName: 'Zara Andersen',   userAvatar: 'https://i.pravatar.cc/64?u=zara2',     rating: 5, date: '2024-06-25', title: 'Highly recommend for working developers', body: 'I have been writing React professionally for three years and this still cleared up several blind spots. Especially around Suspense and concurrent features.', helpfulCount: 158, isVerifiedPurchase: true },
  { id: 'r22', userId: 'u122', userName: 'Bruno Costa',     userAvatar: 'https://i.pravatar.cc/64?u=bruno',     rating: 4, date: '2024-06-12', title: 'Polished and modern', body: 'Course feels production-grade — the code style, the examples, the project architecture. Easy to apply directly at work.', helpfulCount: 104, isVerifiedPurchase: true },
];

const ratingsBreakdown: RatingBreakdownItem[] = [
  { stars: 5, percent: 68 },
  { stars: 4, percent: 21 },
  { stars: 3, percent: 7 },
  { stars: 2, percent: 3 },
  { stars: 1, percent: 1 },
];

const faqs: FAQItem[] = [
  { question: 'Do I get lifetime access?', answer: 'Yes. After enrolling once, you have unlimited access to all course material, future updates, and the Q&A community for as long as the course exists on the platform.' },
  { question: 'What if I am unhappy with the course?', answer: 'We offer a no-questions-asked 30-day money-back guarantee. If the course is not for you, request a refund through your account page and you will be reimbursed in full.' },
  { question: 'Do I need any prior experience?', answer: 'A working knowledge of HTML, CSS, and modern JavaScript (ES6+) is recommended. You do not need previous React experience — the course starts from the fundamentals.' },
  { question: 'Will I get a certificate?', answer: 'Yes. Once you complete every section, a downloadable PDF certificate is issued with your name and the completion date. It can be added to LinkedIn directly from your profile.' },
  { question: 'Are the videos downloadable for offline viewing?', answer: 'Videos are streamable from the web and downloadable in the mobile apps for offline viewing on iOS and Android. Web playback requires an internet connection.' },
  { question: 'How long do I have to complete the course?', answer: 'There is no time limit. Take it at your own pace — go through it in a weekend or spread it over six months. Your progress is automatically saved.' },
  { question: 'Is the course content updated regularly?', answer: 'Yes. Major React releases trigger content updates. Minor patches and clarifications happen monthly based on student questions in the Q&A.' },
  { question: 'Can I get an invoice for my employer?', answer: 'Absolutely. After purchase, visit the Receipts page in your account to download a tax-compliant invoice with your company details.' },
];

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 2);
tomorrow.setHours(tomorrow.getHours() + 6);

export const mockCourseDetail: CourseDetail = {
  ...baseCourse,
  subtitle: 'Master modern React with hooks, TypeScript, performance optimisation, and production patterns used at top tech companies.',
  category: 'Development',
  subcategory: 'Web Development',
  shortDescription: 'Become a confident React developer who ships production-quality applications.',
  longDescription: `Welcome to the most comprehensive React course on the platform. Whether you have written a few components or you are completely new to the framework, this course will take you from the fundamentals to advanced production patterns used inside engineering teams at companies like Meta, Netflix, and Stripe.

You will not be watching code being typed. You will be reasoning about it, predicting what happens next, and building real applications that you can put on your resume the day you finish.

We start with the React mental model — what a component actually is, how rendering works, and why the dependency arrays matter. From there we go deep on hooks: useState, useEffect, useReducer, useMemo, useCallback, useRef, and writing your own. We cover the Context API, when to reach for state management libraries, and how to structure global state without painting yourself into a corner.

By the time we hit routing, you will have built three small projects. The performance optimisation section teaches you to read the React DevTools Profiler, identify and eliminate unnecessary renders, and use code splitting and lazy loading effectively. We finish with concurrent features — useTransition, useDeferredValue, and the Suspense patterns that are quietly redefining how we think about loading states.

Every concept comes with a hands-on exercise. Every section ends with a quiz. The final project is a full-stack dashboard you will be proud to demo at interviews. Join thousands of students who have already shipped React features at work using exactly the patterns taught here.`,
  whatYouWillLearn: [
    'Build production-grade React applications from scratch',
    'Master every built-in hook and write your own custom hooks',
    'Manage state with Context, useReducer, and Zustand',
    'Optimise rendering with memoisation, virtualisation, and lazy loading',
    'Structure scalable component architectures',
    'Use TypeScript effectively in React projects',
    'Implement complex routing with React Router v6',
    'Handle data fetching, caching, and mutations professionally',
    'Test React components with React Testing Library',
    'Deploy React apps to production with confidence',
  ],
  requirements: [
    'A working knowledge of HTML, CSS, and modern JavaScript (ES6+)',
    'A computer running macOS, Windows, or Linux with Node.js 18+ installed',
    'No prior React experience required — we start from the fundamentals',
    'Curiosity and willingness to write code along with the lectures',
  ],
  targetAudience: [
    'Front-end developers wanting to add React to their toolkit',
    'Back-end developers expanding into full-stack roles',
    'JavaScript developers preparing for React-heavy interviews',
    'Self-taught coders who want to fill in gaps in their React knowledge',
    'Students working on personal projects who want to use modern patterns',
  ],
  previewVideoUrl: '/videos/sample.mp4',
  previewThumbnail: 'https://picsum.photos/seed/react-preview/640/360',
  price: 89.99,
  discountPrice: 14.99,
  discountEndsAt: tomorrow.toISOString(),
  ratingsBreakdown,
  reviews,
  faqs,
  features: [
    '42 hours of on-demand video',
    '24 downloadable resources',
    '12 coding exercises',
    'Full lifetime access',
    'Access on mobile and TV',
    'Certificate of completion',
  ],
  relatedCourseIds: ['c011', 'c020', 'c042', 'c002', 'c024', 'c033'],
  instructorBio: {
    headline: 'Senior Engineer @ Meta · Ex-Stripe · React Educator',
    body: `Sarah Chen has been writing JavaScript professionally for over a decade and has worked on consumer products used by hundreds of millions of people. At Meta, she contributes to internal React tooling. Before that, at Stripe, she led the migration of the dashboard's payment flows to a hooks-based architecture.

She has taught React to thousands of engineers across corporate workshops, university guest lectures, and open online courses. Her teaching style emphasises mental models over recipes — once you understand why React behaves the way it does, the framework becomes predictable.

Outside of work, Sarah maintains a small open-source state-management library and writes a fortnightly newsletter on front-end engineering. She lives in San Francisco with her partner and a stubborn rescue terrier named Pixel.`,
    totalStudents: 184_500,
    totalReviews: 28_400,
    totalCourses: 7,
    avgRating: 4.7,
  },
  resourceCount: 24,
  exerciseCount: 12,
};
