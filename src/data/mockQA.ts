import type { QAQuestion, QAAnswer, CohortThread } from '../types/qa';

const HOUR = 3_600_000;
const DAY = 86_400_000;
function ago(ms: number): string { return new Date(Date.now() - ms).toISOString(); }

const COURSE_ID = 'course-001'; // mockCourse
const lec = (n: number) => `l${n}`;

export const mockQuestions: QAQuestion[] = [
    {
        id: 'q1', courseId: COURSE_ID, lectureId: lec(6), authorId: 'u101', authorName: 'Daniel Reyes', authorAvatar: 'https://i.pravatar.cc/64?u=daniel', isInstructor: false,
        title: 'useEffect cleanup running twice — am I doing something wrong?',
        body: 'Following along with the lecture. My cleanup function logs twice on every effect. Is React 18 strict mode the cause? Should I disable it?',
        tags: ['useEffect', 'react18'], upvotes: 38, answerCount: 3, views: 412, pinned: true, resolved: true,
        createdAt: ago(3 * DAY), updatedAt: ago(2 * DAY)
    },
    {
        id: 'q2', courseId: COURSE_ID, lectureId: lec(6), authorId: 'u102', authorName: 'Aisha Khan', authorAvatar: 'https://i.pravatar.cc/64?u=aisha', isInstructor: false,
        title: 'Difference between useEffect and useLayoutEffect?',
        body: 'When should I reach for useLayoutEffect vs useEffect? The mental model in the lecture mostly covered useEffect.',
        tags: ['hooks'], upvotes: 22, answerCount: 2, views: 287, pinned: false, resolved: false,
        createdAt: ago(8 * HOUR), updatedAt: ago(6 * HOUR)
    },
    {
        id: 'q3', courseId: COURSE_ID, lectureId: lec(10), authorId: 'u103', authorName: 'Marco Bianchi', authorAvatar: 'https://i.pravatar.cc/64?u=marco', isInstructor: false,
        title: 'Reducer vs Context — when do I actually need both?',
        body: 'I built the cart with useReducer + useContext. It works but feels heavy for what it does. Is there a rule of thumb?',
        tags: ['useReducer', 'context'], upvotes: 15, answerCount: 1, views: 198, pinned: false, resolved: false,
        createdAt: ago(1 * DAY), updatedAt: ago(20 * HOUR)
    },
    {
        id: 'q4', courseId: COURSE_ID, lectureId: lec(11), authorId: 'u104', authorName: 'Priya Iyer', authorAvatar: 'https://i.pravatar.cc/64?u=priya2', isInstructor: false,
        title: 'useRef vs useState for measuring DOM',
        body: 'I want to measure an element\'s height after render. Should I do it in useEffect with a ref, or store the value in state?',
        tags: ['useRef'], upvotes: 11, answerCount: 1, views: 134, pinned: false, resolved: true,
        createdAt: ago(4 * DAY), updatedAt: ago(3 * DAY)
    },
    {
        id: 'q5', courseId: COURSE_ID, authorId: 'u105', authorName: 'Tom O\'Brien', authorAvatar: 'https://i.pravatar.cc/64?u=tom2', isInstructor: false,
        title: 'Course-wide: best resources after this course?',
        body: 'Once I finish, what would you recommend reading or watching to keep momentum? Particularly interested in production patterns.',
        tags: ['general'], upvotes: 8, answerCount: 2, views: 92, pinned: false, resolved: false,
        createdAt: ago(2 * DAY), updatedAt: ago(2 * DAY)
    },
    {
        id: 'q6', courseId: COURSE_ID, lectureId: lec(12), authorId: 'u106', authorName: 'Hannah Müller', authorAvatar: 'https://i.pravatar.cc/64?u=hannah', isInstructor: false,
        title: 'When does useMemo actually pay off?',
        body: 'I default-applied useMemo everywhere and the app feels slower. Curious about the rule for when memoisation helps vs hurts.',
        tags: ['useMemo', 'performance'], upvotes: 19, answerCount: 1, views: 226, pinned: false, resolved: true,
        createdAt: ago(5 * DAY), updatedAt: ago(4 * DAY)
    },
    {
        id: 'q7', courseId: COURSE_ID, lectureId: lec(6), authorId: 'u107', authorName: 'Yuki Tanaka', authorAvatar: 'https://i.pravatar.cc/64?u=yuki', isInstructor: false,
        title: 'Why does my dependency array cause infinite loop?',
        body: 'Adding an object to deps triggers re-renders forever. I know I should not depend on objects but the lecture made me wonder why React designed it this way.',
        tags: ['useEffect'], upvotes: 14, answerCount: 1, views: 178, pinned: false, resolved: false,
        createdAt: ago(2 * HOUR), updatedAt: ago(2 * HOUR)
    },
    {
        id: 'q8', courseId: COURSE_ID, lectureId: lec(13), authorId: 'u108', authorName: 'Carlos Romero', authorAvatar: 'https://i.pravatar.cc/64?u=carlos2', isInstructor: false,
        title: 'Custom hook returning callbacks — is the function recreated every render?',
        body: 'My custom useFetch returns a refetch function. Consumer says it changes identity every render and breaks their effect deps. Pattern?',
        tags: ['custom-hooks'], upvotes: 9, answerCount: 1, views: 76, pinned: false, resolved: false,
        createdAt: ago(6 * HOUR), updatedAt: ago(6 * HOUR)
    },
];

export const mockAnswers: QAAnswer[] = [
    {
        id: 'a1', questionId: 'q1', authorId: 'u1', authorName: 'Sarah Chen', authorAvatar: 'https://i.pravatar.cc/64?u=sarah', isInstructor: true,
        body: `Great question — and the answer is: nothing is wrong. React 18's Strict Mode intentionally double-invokes effects in development to surface effect-cleanup bugs. In production it runs once.\n\nThink of it as: \`mount → unmount → mount\` in dev to make sure you handle remounts cleanly.`,
        upvotes: 56, isAcceptedAnswer: true, createdAt: ago(3 * DAY - 2 * HOUR)
    },
    {
        id: 'a2', questionId: 'q1', authorId: 'u109', authorName: 'Sophie Laurent', authorAvatar: 'https://i.pravatar.cc/64?u=sophie2', isInstructor: false,
        body: 'Adding to Sarah\'s answer — turning Strict Mode off masks bugs. Better to learn to write idempotent setup/cleanup.',
        upvotes: 12, isAcceptedAnswer: false, createdAt: ago(2 * DAY)
    },
    {
        id: 'a3', questionId: 'q1', authorId: 'u110', authorName: 'Liam Walsh', authorAvatar: 'https://i.pravatar.cc/64?u=liam', isInstructor: false,
        body: 'I had the same panic moment. Ignore it.', upvotes: 3, isAcceptedAnswer: false, createdAt: ago(2 * DAY - 1 * HOUR), parentAnswerId: 'a2'
    },
    {
        id: 'a4', questionId: 'q2', authorId: 'u1', authorName: 'Sarah Chen', authorAvatar: 'https://i.pravatar.cc/64?u=sarah', isInstructor: true,
        body: '`useLayoutEffect` runs synchronously after DOM mutations but before the browser paints. Reach for it when you need to measure layout and apply changes that the user shouldn\'t see flicker.\n\nDefault: useEffect. Reach for useLayoutEffect only when you have a measurable visual flicker.',
        upvotes: 31, isAcceptedAnswer: false, createdAt: ago(7 * HOUR)
    },
    {
        id: 'a5', questionId: 'q2', authorId: 'u111', authorName: 'Nina Petrov', authorAvatar: 'https://i.pravatar.cc/64?u=nina2', isInstructor: false,
        body: 'I use a simple test: if I\'m measuring DOM and then writing to state to apply a style — useLayoutEffect. Otherwise useEffect.', upvotes: 8, isAcceptedAnswer: false, createdAt: ago(5 * HOUR)
    },
    {
        id: 'a6', questionId: 'q3', authorId: 'u1', authorName: 'Sarah Chen', authorAvatar: 'https://i.pravatar.cc/64?u=sarah', isInstructor: true,
        body: 'Heuristic: useReducer when state transitions are interesting (multiple actions, derived state). Context is for sharing values down the tree without prop drilling.\n\nSmall apps: useState + prop drilling.\nMedium: useReducer + context.\nLarger: Zustand or Redux Toolkit — they remove a lot of ceremony around context selectors.',
        upvotes: 24, isAcceptedAnswer: false, createdAt: ago(18 * HOUR)
    },
    {
        id: 'a7', questionId: 'q4', authorId: 'u1', authorName: 'Sarah Chen', authorAvatar: 'https://i.pravatar.cc/64?u=sarah', isInstructor: true,
        body: 'Use a callback ref. Not the standard `useRef` pattern — instead pass a function as the ref and read measurements there. This fires whenever the node mounts/unmounts. Code:\n\n```js\nconst measure = useCallback((node) => {\n  if (node) setHeight(node.getBoundingClientRect().height);\n}, []);\nreturn <div ref={measure} />;\n```',
        upvotes: 18, isAcceptedAnswer: true, createdAt: ago(3 * DAY)
    },
    {
        id: 'a8', questionId: 'q5', authorId: 'u112', authorName: 'Ahmed Hassan', authorAvatar: 'https://i.pravatar.cc/64?u=ahmed', isInstructor: false,
        body: 'I followed up with the React docs (react.dev) and Dan Abramov\'s blog. Both excellent for production patterns.',
        upvotes: 6, isAcceptedAnswer: false, createdAt: ago(1 * DAY)
    },
    {
        id: 'a9', questionId: 'q5', authorId: 'u1', authorName: 'Sarah Chen', authorAvatar: 'https://i.pravatar.cc/64?u=sarah', isInstructor: true,
        body: 'Once you finish, the next track I\'d recommend is the Performance Optimisation course. You\'ll deeply understand the Profiler.',
        upvotes: 14, isAcceptedAnswer: false, createdAt: ago(1 * DAY - 4 * HOUR)
    },
    {
        id: 'a10', questionId: 'q6', authorId: 'u1', authorName: 'Sarah Chen', authorAvatar: 'https://i.pravatar.cc/64?u=sarah', isInstructor: true,
        body: 'useMemo only helps when:\n\n1. The computation is genuinely expensive, **and**\n2. The downstream component is wrapped in React.memo\n\nOtherwise it adds bookkeeping cost without removing renders.',
        upvotes: 28, isAcceptedAnswer: true, createdAt: ago(4 * DAY)
    },
    {
        id: 'a11', questionId: 'q7', authorId: 'u113', authorName: 'Mei Lin', authorAvatar: 'https://i.pravatar.cc/64?u=mei2', isInstructor: false,
        body: 'Object literals are recreated each render so deps see a new identity → re-run → new object → infinite. Use useMemo for the object, or restructure the dep to primitives.',
        upvotes: 11, isAcceptedAnswer: false, createdAt: ago(1 * HOUR)
    },
    {
        id: 'a12', questionId: 'q8', authorId: 'u1', authorName: 'Sarah Chen', authorAvatar: 'https://i.pravatar.cc/64?u=sarah', isInstructor: true,
        body: 'Wrap the function in useCallback inside your hook. Now the consumer\'s effect dep is stable across renders.',
        upvotes: 9, isAcceptedAnswer: false, createdAt: ago(5 * HOUR)
    },
];

export const mockCohortThreads: CohortThread[] = [
    {
        id: 't1', cohortId: 'spring-2025', category: 'announcements',
        title: 'Welcome to the Spring 2025 React cohort',
        authorId: 'u1', authorName: 'Sarah Chen', authorAvatar: 'https://i.pravatar.cc/64?u=sarah',
        body: 'Hi everyone — Sarah here. Excited to learn alongside you. First live session is Tuesday at 6pm ET. Read the syllabus pinned below before we kick off.',
        replyCount: 42, lastReplyAt: ago(2 * HOUR), pinned: true, createdAt: ago(7 * DAY)
    },
    {
        id: 't2', cohortId: 'spring-2025', category: 'general',
        title: 'Anyone else struggling with the third project?',
        authorId: 'u101', authorName: 'Daniel Reyes', authorAvatar: 'https://i.pravatar.cc/64?u=daniel',
        body: 'I have been stuck on the data layer for three days. Open to a study session this weekend.',
        replyCount: 17, lastReplyAt: ago(8 * HOUR), pinned: false, createdAt: ago(2 * DAY)
    },
    {
        id: 't3', cohortId: 'spring-2025', category: 'help',
        title: 'How are you all handling form state?',
        authorId: 'u104', authorName: 'Priya Iyer', authorAvatar: 'https://i.pravatar.cc/64?u=priya2',
        body: 'I have been using react-hook-form. Curious if anyone has tried Conform or stuck with vanilla.',
        replyCount: 9, lastReplyAt: ago(1 * DAY), pinned: false, createdAt: ago(3 * DAY)
    },
    {
        id: 't4', cohortId: 'spring-2025', category: 'showcase',
        title: 'Built a habit tracker with the patterns from week 3',
        authorId: 'u108', authorName: 'Carlos Romero', authorAvatar: 'https://i.pravatar.cc/64?u=carlos2',
        body: 'Live at habits.carlosrom.dev. Feedback welcome — particularly on the data layer.',
        replyCount: 23, lastReplyAt: ago(4 * HOUR), pinned: false, createdAt: ago(4 * DAY)
    },
    {
        id: 't5', cohortId: 'spring-2025', category: 'jobs',
        title: '[Hiring] Frontend engineer at Linear (referral)',
        authorId: 'u115', authorName: 'Olivia Stone', authorAvatar: 'https://i.pravatar.cc/64?u=olivia',
        body: 'Linear is hiring senior frontend. Happy to refer cohort members. DM with portfolio.',
        replyCount: 4, lastReplyAt: ago(1 * DAY), pinned: false, createdAt: ago(5 * DAY)
    },
    {
        id: 't6', cohortId: 'spring-2025', category: 'general',
        title: 'Best VS Code extensions for React?',
        authorId: 'u106', authorName: 'Hannah Müller', authorAvatar: 'https://i.pravatar.cc/64?u=hannah',
        body: 'Sharing my list — would love to hear yours. ESLint, Prettier, Error Lens, GitHub Copilot, vscode-styled-components.',
        replyCount: 31, lastReplyAt: ago(12 * HOUR), pinned: false, createdAt: ago(6 * DAY)
    },
];
