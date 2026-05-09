import type { TranscriptCue } from '../types/notes';

// Generic placeholder cues per lecture id (sample.mp4 plays for ~10 minutes max).
// In a real system these would be ASR-generated and editable.
const baseCues: TranscriptCue[] = [
  { start: 0,    end: 6,   speaker: 'Sarah Chen', text: 'Welcome back. In this lecture we are going to build on the mental model from the previous section.' },
  { start: 6,    end: 14,  speaker: 'Sarah Chen', text: 'I want you to think about a component as a function — input is props, output is a description of UI.' },
  { start: 14,   end: 22,  speaker: 'Sarah Chen', text: 'That description is then handed to React, which figures out the smallest set of DOM changes to apply.' },
  { start: 22,   end: 30,  speaker: 'Sarah Chen', text: 'This is the key insight. You are never imperatively manipulating the DOM. You describe state, React reconciles.' },
  { start: 30,   end: 38,  speaker: 'Sarah Chen', text: 'Let me show you a concrete example. Open the codebase from the resources and follow along.' },
  { start: 38,   end: 47,  speaker: 'Sarah Chen', text: 'Notice how the `useState` hook gives you a getter and a setter. The setter triggers a re-render.' },
  { start: 47,   end: 56,  speaker: 'Sarah Chen', text: 'A re-render is just React calling your function again with the new state. That is it. Nothing magical.' },
  { start: 56,   end: 65,  speaker: 'Sarah Chen', text: 'A common mistake is mutating state directly. Always return a new object or array from your setter.' },
  { start: 65,   end: 75,  speaker: 'Sarah Chen', text: 'If you mutate, React cannot detect the change because reference equality has not changed.' },
  { start: 75,   end: 85,  speaker: 'Sarah Chen', text: 'This is the same reason your useEffect dependency arrays must be honest. Lying about dependencies leads to stale closures.' },
  { start: 85,   end: 94,  speaker: 'Sarah Chen', text: 'When you read a value inside an effect, that value is captured at the time the effect was scheduled.' },
  { start: 94,   end: 104, speaker: 'Sarah Chen', text: 'If your dependency array does not include it, you will keep reading the stale value on every run.' },
  { start: 104,  end: 114, speaker: 'Sarah Chen', text: 'Linting helps. Turn on the React Hooks ESLint rules and trust them by default.' },
  { start: 114,  end: 124, speaker: 'Sarah Chen', text: 'Let me also call out the difference between rendering and committing.' },
  { start: 124,  end: 134, speaker: 'Sarah Chen', text: 'Rendering is calling your function. Committing is when React actually updates the DOM and runs effects.' },
  { start: 134,  end: 144, speaker: 'Sarah Chen', text: 'Most of the time you do not need to think about this. But during performance work you will.' },
  { start: 144,  end: 156, speaker: 'Sarah Chen', text: 'In the next lecture we will dig into the `useReducer` hook and when to reach for it over `useState`.' },
  { start: 156,  end: 168, speaker: 'Sarah Chen', text: 'Quick spoiler: when you have multiple state values that change together, or when state transitions are complex.' },
  { start: 168,  end: 180, speaker: 'Sarah Chen', text: 'Reducers also make your state changes serialisable, which becomes important when we discuss undo and time-travel debugging.' },
  { start: 180,  end: 192, speaker: 'Sarah Chen', text: 'For now, let me leave you with one practical exercise. Open the playground and convert the counter to use a reducer.' },
  { start: 192,  end: 204, speaker: 'Sarah Chen', text: 'Pay attention to how the action types describe intent rather than the new value.' },
  { start: 204,  end: 216, speaker: 'Sarah Chen', text: 'That is the shift in mindset. From setting state to dispatching events.' },
  { start: 216,  end: 228, speaker: 'Sarah Chen', text: 'Alright. That is enough for now. See you in the next one.' },
];

const TRANSCRIPTS: Record<string, TranscriptCue[]> = {
  // mockCourse.json lecture ids
  l1: baseCues, l2: baseCues, l3: baseCues, l4: baseCues, l5: baseCues,
  l6: baseCues, l7: baseCues, l8: baseCues, l9: baseCues, l10: baseCues,
  l11: baseCues, l12: baseCues, l13: baseCues, l14: baseCues, l15: baseCues,
  l16: baseCues, l17: baseCues, l18: baseCues, l19: baseCues, l20: baseCues,
  l21: baseCues, l22: baseCues, l23: baseCues, l24: baseCues, l25: baseCues,
  l26: baseCues, l27: baseCues,
};

export function getTranscriptFor(lectureId: string): TranscriptCue[] {
  return TRANSCRIPTS[lectureId] ?? baseCues;
}
