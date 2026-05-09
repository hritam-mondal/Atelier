import type { ProgressData } from '../types/course';

const storageKey = (courseId: string) => `course_progress_${courseId}`;

export function loadProgress(courseId: string): ProgressData | null {
  try {
    const raw = localStorage.getItem(storageKey(courseId));
    if (!raw) return null;
    return JSON.parse(raw) as ProgressData;
  } catch {
    return null;
  }
}

export function saveProgress(courseId: string, data: ProgressData): void {
  try {
    localStorage.setItem(storageKey(courseId), JSON.stringify(data));
  } catch {
    // localStorage quota exceeded — silently ignore
  }
}
