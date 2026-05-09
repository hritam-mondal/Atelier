import { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), 400);
  };
  const hide = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className={`
            absolute z-50 whitespace-nowrap rounded px-2 py-1 text-xs
            bg-gray-800 text-gray-100 border border-gray-700
            pointer-events-none select-none
            ${position === 'top' ? 'bottom-full mb-1.5 left-1/2 -translate-x-1/2' : 'top-full mt-1.5 left-1/2 -translate-x-1/2'}
          `}
        >
          {content}
        </span>
      )}
    </span>
  );
}
