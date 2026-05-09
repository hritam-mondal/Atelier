import type { Quiz } from '../types/assessment';

export const mockQuizzes: Quiz[] = [
    {
        id: 'quiz-fundamentals',
        courseId: 'course-001',
        sectionId: 's2',
        insertAfterLectureId: 'l8',
        title: 'React Fundamentals — knowledge check',
        description: '5 questions · 7 minutes. You need 60% to pass.',
        passingScore: 0.6,
        shuffleQuestions: false,
        questions: [
            {
                id: 'q1', kind: 'multiple-choice', points: 1,
                prompt: 'What does the **`useState`** hook return?',
                options: [
                    { id: 'a', text: 'A single value representing the current state', correct: false },
                    { id: 'b', text: 'A pair: current state value and a setter function', correct: true },
                    { id: 'c', text: 'A promise that resolves to the current state', correct: false },
                    { id: 'd', text: 'An object with `value` and `set` properties', correct: false },
                ],
                explanation: 'It returns a tuple: `[state, setState]`.',
            },
            {
                id: 'q2', kind: 'true-false', points: 1,
                prompt: 'Calling the setter from `useState` always triggers an immediate re-render synchronously.',
                correctAnswer: false,
                explanation: 'React batches state updates. The re-render is scheduled, not synchronous.',
            },
            {
                id: 'q3', kind: 'multi-select', points: 2,
                prompt: 'Which of the following are valid uses of **`useEffect`**? (Select all that apply.)',
                options: [
                    { id: 'a', text: 'Fetching data when a component mounts', correct: true },
                    { id: 'b', text: 'Subscribing to a WebSocket and unsubscribing on unmount', correct: true },
                    { id: 'c', text: 'Calculating a derived value from props', correct: false },
                    { id: 'd', text: 'Synchronising with an external system like a third-party widget', correct: true },
                ],
                explanation: 'Effects synchronise with external systems; derived values should be computed inline or with `useMemo`.',
            },
            {
                id: 'q4', kind: 'short-answer', points: 1,
                prompt: 'Name the React API for sharing data through the component tree without prop drilling.',
                acceptableAnswers: ['context', 'react context', 'context api', 'usecontext'],
                explanation: 'The Context API — used via `createContext` + `useContext`.',
            },
            {
                id: 'q5', kind: 'code', points: 3, language: 'javascript',
                prompt: 'Write a function `sum(arr)` that returns the sum of all numbers in `arr`. Return 0 for an empty array.',
                starterCode: 'function sum(arr) {\n  // your code here\n}',
                solution: 'function sum(arr) { return arr.reduce((a, b) => a + b, 0); }',
                testCases: [
                    { input: [[]], expected: 0, label: 'empty array → 0' },
                    { input: [[1, 2, 3]], expected: 6, label: '[1,2,3] → 6' },
                    { input: [[10, -5, 5]], expected: 10, label: '[10,-5,5] → 10' },
                    { input: [[100]], expected: 100, label: '[100] → 100' },
                ],
                explanation: '`Array.prototype.reduce` with `(a, b) => a + b` and initial 0.',
            },
        ],
    },
    {
        id: 'quiz-hooks',
        courseId: 'course-001',
        sectionId: 's3',
        insertAfterLectureId: 'l13',
        title: 'Hooks deep-dive — knowledge check',
        description: '4 questions · 5 minutes. You need 60% to pass.',
        passingScore: 0.6,
        shuffleQuestions: false,
        questions: [
            {
                id: 'h1', kind: 'multiple-choice', points: 1,
                prompt: 'When should you reach for **`useReducer`** over **`useState`**?',
                options: [
                    { id: 'a', text: 'Always — `useReducer` is faster.', correct: false },
                    { id: 'b', text: 'When state transitions are complex or involve multiple sub-values.', correct: true },
                    { id: 'c', text: 'Only when sharing state via context.', correct: false },
                    { id: 'd', text: 'Only in class components.', correct: false },
                ],
            },
            {
                id: 'h2', kind: 'true-false', points: 1,
                prompt: 'Custom hooks must start with the prefix `use`.',
                correctAnswer: true,
                explanation: 'The `use` prefix is what tells React (and the linter) that hook rules apply.',
            },
            {
                id: 'h3', kind: 'multiple-choice', points: 1,
                prompt: '`useMemo` is most useful when:',
                options: [
                    { id: 'a', text: 'You want to skip a computation and the consumer is wrapped in `React.memo`.', correct: true },
                    { id: 'b', text: 'You want to memoise every value in your component for safety.', correct: false },
                    { id: 'c', text: 'You need to share state across components.', correct: false },
                ],
            },
            {
                id: 'h4', kind: 'code', points: 2, language: 'javascript',
                prompt: 'Write `clamp(x, min, max)` that returns x bounded between min and max.',
                starterCode: 'function clamp(x, min, max) {\n  // your code here\n}',
                solution: 'function clamp(x, min, max) { return Math.min(Math.max(x, min), max); }',
                testCases: [
                    { input: [5, 0, 10], expected: 5, label: 'within range' },
                    { input: [-3, 0, 10], expected: 0, label: 'below min' },
                    { input: [42, 0, 10], expected: 10, label: 'above max' },
                    { input: [0, 0, 0], expected: 0, label: 'all zero' },
                ],
            },
        ],
    },
];

export function findQuizForLecture(lectureId: string): Quiz | undefined {
    return mockQuizzes.find(q => q.insertAfterLectureId === lectureId);
}

export function getQuizById(id: string): Quiz | undefined {
    return mockQuizzes.find(q => q.id === id);
}
