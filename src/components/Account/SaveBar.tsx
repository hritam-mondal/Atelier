interface Props {
  visible: boolean;
  onSave: () => void;
  onDiscard: () => void;
  saving?: boolean;
}

export function SaveBar({ visible, onSave, onDiscard, saving }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div
        className="max-w-[1280px] mx-auto m-4 rounded-xl px-4 py-3 flex items-center justify-between gap-4 shadow-2xl"
        style={{
          backgroundColor: '#22252b',
          border: '1px solid rgba(236,230,216,0.20)',
        }}
      >
        <span className="text-sm" style={{ color: '#ece6d8' }}>
          You have unsaved changes.
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onDiscard}
            disabled={saving}
            className="px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-70 transition-opacity disabled:opacity-50"
            style={{ color: '#b8b3a7' }}
          >
            Discard
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-1.5 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
