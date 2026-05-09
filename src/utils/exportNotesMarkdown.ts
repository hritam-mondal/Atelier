import type { Note } from '../types/notes';
import type { Course } from '../types/course';
import { formatTime } from './formatTime';

export function exportNotesMarkdown(course: Course, notes: Note[]): string {
  const out: string[] = [];
  out.push('---');
  out.push(`title: "${course.title} — Notes"`);
  out.push(`instructor: "${course.instructor.name}"`);
  out.push(`exported: "${new Date().toISOString()}"`);
  out.push(`note_count: ${notes.length}`);
  out.push('---');
  out.push('');
  out.push(`# ${course.title} — Notes`);
  out.push('');

  // Group by lecture
  const byLecture = new Map<string, Note[]>();
  for (const n of notes) {
    if (!byLecture.has(n.lectureId)) byLecture.set(n.lectureId, []);
    byLecture.get(n.lectureId)!.push(n);
  }

  for (const section of course.sections) {
    for (const lecture of section.lectures) {
      const lectureNotes = byLecture.get(lecture.id);
      if (!lectureNotes || lectureNotes.length === 0) continue;
      out.push(`## ${section.title} · ${lecture.title}`);
      out.push('');
      lectureNotes
        .sort((a, b) => a.timestamp - b.timestamp)
        .forEach(n => {
          out.push(`### ${formatTime(n.timestamp)}`);
          if (n.tags.length) out.push(`*Tags: ${n.tags.join(', ')}*`);
          out.push('');
          out.push(n.body || '*(empty)*');
          out.push('');
        });
    }
  }

  return out.join('\n');
}

export function downloadNotes(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
