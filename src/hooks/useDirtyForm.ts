import { useEffect, useRef, useState } from 'react';

export function useDirtyForm<T>(initial: T): {
  value: T;
  setValue: (next: T) => void;
  dirty: boolean;
  reset: () => void;
  setBaseline: (next: T) => void;
} {
  const [value, setValue] = useState<T>(initial);
  const baseline = useRef(initial);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDirty(JSON.stringify(value) !== JSON.stringify(baseline.current));
  }, [value]);

  // Warn on navigation if dirty
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const reset = () => {
    setValue(baseline.current);
  };
  const setBaseline = (next: T) => {
    baseline.current = next;
    setValue(next);
    setDirty(false);
  };

  return { value, setValue, dirty, reset, setBaseline };
}
