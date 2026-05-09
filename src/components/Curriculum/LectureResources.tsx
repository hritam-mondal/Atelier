import { FileText, Download } from 'lucide-react';
import type { Resource } from '../../types/course';

interface LectureResourcesProps {
  resources: Resource[];
}

export function LectureResources({ resources }: LectureResourcesProps) {
  if (resources.length === 0) return null;

  return (
    <div className="ml-8 mt-1 mb-2 space-y-1">
      {resources.map((r) => (
        <a
          key={r.url}
          href={r.url}
          download
          className="flex items-center gap-2 text-xs text-violet-400 hover:text-violet-300 py-1 px-2 rounded hover:bg-white/5 transition-colors group"
          aria-label={`Download ${r.label}`}
        >
          <FileText size={12} aria-hidden="true" className="shrink-0 text-violet-500" />
          <span className="truncate flex-1">{r.label}</span>
          <Download size={12} aria-hidden="true" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      ))}
    </div>
  );
}
