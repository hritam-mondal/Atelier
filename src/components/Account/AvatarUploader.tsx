import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface Props {
  value: string;
  fallbackInitial: string;
  onChange: (next: string) => void;
}

export function AvatarUploader({ value, fallbackInitial, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      if (typeof e.target?.result === 'string') onChange(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-5">
      <div
        className={`relative w-24 h-24 rounded-full overflow-hidden flex items-center justify-center transition-all`}
        style={{
          backgroundColor: 'rgba(236,230,216,0.10)',
          border: dragging ? '2px dashed #ece6d8' : '2px solid rgba(236,230,216,0.20)',
        }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
      >
        {value ? (
          <img src={value} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="font-display text-3xl italic" style={{ color: '#ece6d8' }}>
            {fallbackInitial}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity"
          style={{ border: '1px solid rgba(236,230,216,0.25)', color: '#ece6d8' }}
        >
          <Upload size={11} aria-hidden /> Upload image
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="inline-flex items-center gap-1 text-[11px] hover:opacity-70 transition-opacity self-start"
            style={{ color: '#b8b3a7' }}
          >
            <X size={10} aria-hidden /> Remove
          </button>
        )}
        <p className="text-[11px]" style={{ color: '#8a857a' }}>
          Square image, JPG or PNG, max 5 MB.
        </p>
        {error && <p className="text-[11px] text-rose-400">{error}</p>}
      </div>
    </div>
  );
}
