import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, ChevronUp, ChevronDown, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { useInstructor } from '../../context/InstructorContext';
import { formatInvoiceDate } from '../../utils/formatInvoice';
import type { CourseDraft, LectureDraft, SectionDraft } from '../../types/instructor';

export function CourseEditor() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useInstructor();
  const draft = state.drafts.find(d => d.id === id);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // "Auto-saved" indicator — re-render whenever draft changes
  useEffect(() => {
    if (!draft) return;
    setSavedAt(draft.lastUpdatedAt);
  }, [draft?.lastUpdatedAt, draft]);

  if (!draft) {
    return (
      <div className="text-center py-12">
        <p className="text-sm mb-4" style={{ color: '#b8b3a7' }}>Course not found.</p>
        <Link to="/instructor/courses" className="text-sm hover:opacity-70" style={{ color: '#ece6d8' }}>
          ← Back to courses
        </Link>
      </div>
    );
  }

  const update = (patch: Partial<CourseDraft>) => dispatch({ type: 'UPDATE_DRAFT', id: draft.id, patch });
  const addSection = () => dispatch({ type: 'ADD_SECTION', draftId: draft.id, title: 'New section' });
  const removeSection = (sectionId: string) => {
    if (confirm('Remove this section and all its lectures?')) {
      dispatch({ type: 'REMOVE_SECTION', draftId: draft.id, sectionId });
    }
  };
  const updateSection = (sectionId: string, patch: Partial<SectionDraft>) =>
    dispatch({ type: 'UPDATE_SECTION', draftId: draft.id, sectionId, patch });
  const addLecture = (sectionId: string) =>
    dispatch({ type: 'ADD_LECTURE', draftId: draft.id, sectionId, title: 'New lecture' });
  const removeLecture = (sectionId: string, lectureId: string) =>
    dispatch({ type: 'REMOVE_LECTURE', draftId: draft.id, sectionId, lectureId });
  const updateLecture = (sectionId: string, lectureId: string, patch: Partial<LectureDraft>) =>
    dispatch({ type: 'UPDATE_LECTURE', draftId: draft.id, sectionId, lectureId, patch });

  const moveSection = (sectionId: string, dir: -1 | 1) => {
    const ids = draft.sections.map(s => s.id);
    const idx = ids.indexOf(sectionId);
    const swap = idx + dir;
    if (swap < 0 || swap >= ids.length) return;
    [ids[idx], ids[swap]] = [ids[swap], ids[idx]];
    dispatch({ type: 'REORDER_SECTIONS', draftId: draft.id, orderedIds: ids });
  };

  // Publish checklist
  const checks = [
    { ok: draft.title.trim().length > 5,                         label: 'Title (more than 5 chars)' },
    { ok: draft.subtitle.trim().length >= 20,                    label: 'Subtitle (20+ chars)' },
    { ok: draft.whatYouLearn.length >= 4,                        label: 'At least 4 learning outcomes' },
    { ok: draft.sections.length >= 2,                            label: 'At least 2 sections' },
    { ok: draft.sections.reduce((s, sec) => s + sec.lectures.length, 0) >= 5, label: 'At least 5 lectures' },
    { ok: draft.longDescription.trim().length >= 250,            label: 'Description (250+ chars)' },
    { ok: !!draft.thumbnail,                                     label: 'Thumbnail uploaded' },
  ];
  const allReady = checks.every(c => c.ok);

  const publish = () => {
    if (!allReady) return;
    dispatch({ type: 'PUBLISH_DRAFT', id: draft.id });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link to="/instructor/courses" className="inline-flex items-center gap-1 text-xs hover:opacity-70 transition-opacity" style={{ color: '#b8b3a7' }}>
          <ArrowLeft size={11} aria-hidden /> Back to courses
        </Link>
        <div className="flex items-center gap-2 text-xs" style={{ color: '#8a857a' }}>
          <Save size={11} aria-hidden />
          {savedAt ? `Saved ${formatInvoiceDate(savedAt)}` : 'Auto-saving'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_18rem] gap-6">
        <div className="space-y-6">
          {/* Basic info */}
          <Section title="Basic info">
            <Field label="Title">
              <input type="text" value={draft.title} onChange={e => update({ title: e.target.value })} className="w-full bg-transparent outline-none text-sm" style={{ color: '#ece6d8' }} />
            </Field>
            <Field label="Subtitle">
              <input type="text" value={draft.subtitle} onChange={e => update({ subtitle: e.target.value })} className="w-full bg-transparent outline-none text-sm" style={{ color: '#ece6d8' }} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Category">
                <input type="text" value={draft.category} onChange={e => update({ category: e.target.value })} className="w-full bg-transparent outline-none text-sm" style={{ color: '#ece6d8' }} />
              </Field>
              <Field label="Level">
                <select value={draft.level} onChange={e => update({ level: e.target.value as CourseDraft['level'] })} className="w-full bg-transparent outline-none text-sm cursor-pointer" style={{ color: '#ece6d8' }}>
                  {(['beginner','intermediate','advanced','all-levels'] as const).map(l => (
                    <option key={l} value={l} style={{ backgroundColor: '#1d2025' }}>{l}</option>
                  ))}
                </select>
              </Field>
              <Field label="Price (USD)">
                <input type="number" min={0} value={draft.price} onChange={e => update({ price: parseFloat(e.target.value) || 0 })} className="w-full bg-transparent outline-none text-sm" style={{ color: '#ece6d8' }} />
              </Field>
            </div>
            <Field label={`Description · ${draft.longDescription.length} chars`}>
              <textarea
                rows={5}
                value={draft.longDescription}
                onChange={e => update({ longDescription: e.target.value })}
                className="w-full bg-transparent outline-none text-sm resize-y leading-relaxed"
                style={{ color: '#ece6d8' }}
              />
            </Field>
          </Section>

          {/* Curriculum */}
          <Section title="Curriculum">
            <div className="space-y-3">
              {draft.sections.map((section, sIdx) => (
                <div key={section.id} className="rounded-lg" style={{ border: '1px solid rgba(236,230,216,0.15)' }}>
                  <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
                    <div className="flex flex-col">
                      <button onClick={() => moveSection(section.id, -1)} disabled={sIdx === 0} aria-label="Move up" className="rounded p-0.5 hover:opacity-70 disabled:opacity-30">
                        <ChevronUp size={11} style={{ color: '#b8b3a7' }} />
                      </button>
                      <button onClick={() => moveSection(section.id, 1)} disabled={sIdx === draft.sections.length - 1} aria-label="Move down" className="rounded p-0.5 hover:opacity-70 disabled:opacity-30">
                        <ChevronDown size={11} style={{ color: '#b8b3a7' }} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={section.title}
                      onChange={e => updateSection(section.id, { title: e.target.value })}
                      className="flex-1 bg-transparent outline-none text-sm font-medium"
                      style={{ color: '#ece6d8' }}
                      aria-label="Section title"
                    />
                    <span className="text-xs" style={{ color: '#8a857a' }}>
                      {section.lectures.length} {section.lectures.length === 1 ? 'lecture' : 'lectures'}
                    </span>
                    <button onClick={() => removeSection(section.id)} aria-label="Remove section" className="rounded p-1 hover:opacity-70 transition-opacity">
                      <Trash2 size={12} style={{ color: '#c5897a' }} />
                    </button>
                  </div>
                  <div className="px-3 py-2 space-y-1">
                    {section.lectures.map(lecture => (
                      <div
                        key={lecture.id}
                        className="flex items-center gap-2 px-2 py-1.5 rounded"
                        style={{ backgroundColor: 'rgba(236,230,216,0.02)' }}
                      >
                        <input
                          type="text"
                          value={lecture.title}
                          onChange={e => updateLecture(section.id, lecture.id, { title: e.target.value })}
                          className="flex-1 bg-transparent outline-none text-sm"
                          style={{ color: '#ece6d8' }}
                        />
                        <label className="inline-flex items-center gap-1 cursor-pointer text-xs" style={{ color: '#b8b3a7' }}>
                          <input
                            type="checkbox"
                            checked={lecture.isFreePreview}
                            onChange={e => updateLecture(section.id, lecture.id, { isFreePreview: e.target.checked })}
                            className="accent-[#ece6d8]"
                          />
                          Free preview
                        </label>
                        <button onClick={() => removeLecture(section.id, lecture.id)} aria-label="Remove lecture" className="rounded p-1 hover:opacity-70 transition-opacity">
                          <Trash2 size={11} style={{ color: '#8a857a' }} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addLecture(section.id)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs hover:opacity-70 transition-opacity"
                      style={{ color: '#ece6d8' }}
                    >
                      <Plus size={11} aria-hidden /> Add lecture
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={addSection}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ border: '1px dashed rgba(236,230,216,0.25)', color: '#ece6d8' }}
              >
                <Plus size={13} aria-hidden /> Add section
              </button>
            </div>
          </Section>

          {/* What you learn */}
          <Section title="What students will learn">
            <ListEditor
              items={draft.whatYouLearn}
              onChange={items => update({ whatYouLearn: items })}
              placeholder="One outcome per line"
            />
          </Section>

          <Section title="Requirements">
            <ListEditor
              items={draft.requirements}
              onChange={items => update({ requirements: items })}
              placeholder="What students need before they start"
            />
          </Section>
        </div>

        {/* Right rail — publish */}
        <aside
          className="rounded-xl p-5 lg:sticky lg:top-24 lg:self-start"
          style={{ border: '1px solid rgba(236,230,216,0.10)', backgroundColor: 'rgba(236,230,216,0.04)' }}
        >
          <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: '#b8b3a7' }}>
            Status
          </p>
          <p className="font-display text-xl mb-4 capitalize" style={{ color: '#ece6d8' }}>
            {draft.status.replace('_', ' ')}
          </p>

          {draft.status !== 'published' && (
            <>
              <p className="text-xs mb-3" style={{ color: '#8a857a' }}>
                Publish checklist
              </p>
              <ul className="space-y-1.5 mb-5">
                {checks.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    {c.ok ? (
                      <CheckCircle2 size={12} style={{ color: '#a8c08a' }} className="shrink-0 mt-0.5" aria-hidden />
                    ) : (
                      <AlertCircle size={12} style={{ color: '#d8c594' }} className="shrink-0 mt-0.5" aria-hidden />
                    )}
                    <span style={{ color: c.ok ? '#ece6d8' : '#b8b3a7' }}>{c.label}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={publish}
                disabled={!allReady}
                className="w-full px-4 py-2.5 rounded-full text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: '#ece6d8', color: '#15171a' }}
              >
                {allReady ? 'Publish' : 'Complete checklist to publish'}
              </button>
            </>
          )}

          {draft.status === 'published' && (
            <button
              onClick={() => { if (confirm('Archive this course?')) { dispatch({ type: 'ARCHIVE_DRAFT', id: draft.id }); navigate('/instructor/courses'); } }}
              className="w-full px-4 py-2.5 rounded-full text-sm font-semibold hover:opacity-80 transition-opacity"
              style={{ border: '1px solid rgba(197,137,122,0.40)', color: '#c5897a' }}
            >
              Archive course
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display tracking-tight text-lg mb-3" style={{ color: '#ece6d8' }}>{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.18em] uppercase mb-1.5" style={{ color: '#b8b3a7' }}>{label}</label>
      <div
        className="px-3 py-2 rounded-lg transition-colors focus-within:border-[rgba(236,230,216,0.5)]"
        style={{ border: '1px solid rgba(236,230,216,0.20)', backgroundColor: 'rgba(255,255,255,0.02)' }}
      >
        {children}
      </div>
    </div>
  );
}

function ListEditor({ items, onChange, placeholder }: { items: string[]; onChange: (items: string[]) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={e => { const next = [...items]; next[i] = e.target.value; onChange(next); }}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 rounded-lg outline-none text-sm"
            style={{ border: '1px solid rgba(236,230,216,0.15)', backgroundColor: 'rgba(255,255,255,0.02)', color: '#ece6d8' }}
          />
          <button
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            aria-label="Remove"
            className="rounded p-1.5 hover:opacity-70 transition-opacity"
          >
            <Trash2 size={12} style={{ color: '#8a857a' }} />
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, ''])}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs hover:opacity-80 transition-opacity"
        style={{ border: '1px dashed rgba(236,230,216,0.25)', color: '#ece6d8' }}
      >
        <Plus size={11} aria-hidden /> Add item
      </button>
    </div>
  );
}
