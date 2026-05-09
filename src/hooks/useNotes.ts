import { useEffect, useState, useCallback } from 'react';
import type { Note } from '../types/notes';

const STORAGE_KEY = 'notes-v1';

function readAll(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeAll(notes: Note[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch { /* noop */ }
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => readAll());

  useEffect(() => { writeAll(notes); }, [notes]);

  const addNote = useCallback((courseId: string, lectureId: string, timestamp: number, body = ''): Note => {
    const note: Note = {
      id: `note_${Date.now()}_${Math.floor(Math.random() * 1e6)}`,
      lectureId, courseId, timestamp, body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
    };
    setNotes(prev => [note, ...prev]);
    return note;
  }, []);

  const updateNote = useCallback((id: string, patch: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  return { notes, addNote, updateNote, deleteNote };
}
