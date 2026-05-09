import { useState } from 'react';
import { Plus, Trash2, Globe, Code2, MessageCircle, Briefcase } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import { useDirtyForm } from '../../hooks/useDirtyForm';
import { AvatarUploader } from './AvatarUploader';
import { SaveBar } from './SaveBar';
import type { ProfileFields, SocialKind } from '../../types/account';

interface FormShape {
  name: string;
  avatar: string;
  profile: ProfileFields;
}

const SOCIAL_ICONS: Record<SocialKind, LucideIcon> = {
  twitter: MessageCircle,
  github: Code2,
  linkedin: Briefcase,
  website: Globe,
};

const SOCIAL_LABELS: Record<SocialKind, string> = {
  twitter: 'Twitter / X',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  website: 'Website',
};

export function ProfilePage() {
  const { state: user } = useUser();
  const { state: auth, dispatch } = useAuth();
  const initial: FormShape = {
    name: user.user.name,
    avatar: user.user.avatar,
    profile: auth.profile,
  };
  const { value, setValue, dirty, reset, setBaseline } = useDirtyForm<FormShape>(initial);
  const [saving, setSaving] = useState(false);

  const onSave = () => {
    setSaving(true);
    setTimeout(() => {
      dispatch({ type: 'UPDATE_PROFILE', profile: value.profile });
      setBaseline(value);
      setSaving(false);
    }, 600);
  };

  const updateProfile = (patch: Partial<ProfileFields>) => {
    setValue({ ...value, profile: { ...value.profile, ...patch } });
  };

  const updateSocial = (idx: number, patch: Partial<{ kind: SocialKind; url: string }>) => {
    const next = [...value.profile.socialLinks];
    next[idx] = { ...next[idx], ...patch };
    updateProfile({ socialLinks: next });
  };

  const addSocial = () => {
    updateProfile({ socialLinks: [...value.profile.socialLinks, { kind: 'website', url: '' }] });
  };

  const removeSocial = (idx: number) => {
    updateProfile({ socialLinks: value.profile.socialLinks.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-10">
      <Section title="Profile photo">
        <AvatarUploader
          value={value.avatar}
          fallbackInitial={value.name.charAt(0)}
          onChange={(next) => setValue({ ...value, avatar: next })}
        />
      </Section>

      <Section title="Identity">
        <Field label="Name">
          <input
            type="text"
            value={value.name}
            onChange={e => setValue({ ...value, name: e.target.value })}
            className="w-full bg-transparent outline-none text-sm"
            style={{ color: '#ece6d8' }}
          />
        </Field>
        <Field label="Headline" hint="A one-liner shown beside your name.">
          <input
            type="text"
            value={value.profile.headline}
            onChange={e => updateProfile({ headline: e.target.value })}
            placeholder="Senior PM · Building learning habits"
            className="w-full bg-transparent outline-none text-sm"
            style={{ color: '#ece6d8' }}
          />
        </Field>
        <Field label={`Bio · ${value.profile.bio.length} / 1000`}>
          <textarea
            rows={4}
            maxLength={1000}
            value={value.profile.bio}
            onChange={e => updateProfile({ bio: e.target.value })}
            placeholder="Tell people who you are and what you're learning."
            className="w-full bg-transparent outline-none text-sm resize-y leading-relaxed"
            style={{ color: '#ece6d8' }}
          />
        </Field>
      </Section>

      <Section title="Social links">
        <div className="space-y-2">
          {value.profile.socialLinks.map((link, idx) => {
            const Icon = SOCIAL_ICONS[link.kind];
            return (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-lg px-3 py-2"
                style={{ border: '1px solid rgba(236,230,216,0.15)', backgroundColor: 'rgba(255,255,255,0.02)' }}
              >
                <Icon size={14} aria-hidden style={{ color: '#b8b3a7' }} />
                <select
                  value={link.kind}
                  onChange={e => updateSocial(idx, { kind: e.target.value as SocialKind })}
                  className="bg-transparent outline-none text-xs cursor-pointer"
                  style={{ color: '#ece6d8' }}
                  aria-label="Type"
                >
                  {(Object.keys(SOCIAL_LABELS) as SocialKind[]).map(k => (
                    <option key={k} value={k} style={{ backgroundColor: '#1d2025' }}>{SOCIAL_LABELS[k]}</option>
                  ))}
                </select>
                <input
                  type="url"
                  value={link.url}
                  onChange={e => updateSocial(idx, { url: e.target.value })}
                  placeholder="https://"
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: '#ece6d8' }}
                />
                <button
                  type="button"
                  onClick={() => removeSocial(idx)}
                  aria-label="Remove link"
                  className="rounded p-1 hover:opacity-70 transition-opacity"
                >
                  <Trash2 size={13} style={{ color: '#b8b3a7' }} />
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={addSocial}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity"
            style={{ border: '1px dashed rgba(236,230,216,0.25)', color: '#ece6d8' }}
          >
            <Plus size={11} aria-hidden /> Add link
          </button>
        </div>
      </Section>

      <Section title="Preferences">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Timezone">
            <select
              value={value.profile.timezone}
              onChange={e => updateProfile({ timezone: e.target.value })}
              className="w-full bg-transparent outline-none text-sm cursor-pointer"
              style={{ color: '#ece6d8' }}
            >
              {['America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Lisbon', 'Asia/Tokyo', 'Australia/Sydney'].map(tz => (
                <option key={tz} value={tz} style={{ backgroundColor: '#1d2025' }}>{tz}</option>
              ))}
            </select>
          </Field>
          <Field label="Language">
            <select
              value={value.profile.language}
              onChange={e => updateProfile({ language: e.target.value })}
              className="w-full bg-transparent outline-none text-sm cursor-pointer"
              style={{ color: '#ece6d8' }}
            >
              <option value="en" style={{ backgroundColor: '#1d2025' }}>English</option>
              <option value="es" style={{ backgroundColor: '#1d2025' }}>Español</option>
              <option value="fr" style={{ backgroundColor: '#1d2025' }}>Français</option>
              <option value="pt" style={{ backgroundColor: '#1d2025' }}>Português</option>
            </select>
          </Field>
        </div>
      </Section>

      <SaveBar visible={dirty} onSave={onSave} onDiscard={reset} saving={saving} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display tracking-tight text-xl mb-4" style={{ color: '#ece6d8' }}>
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.18em] uppercase mb-1.5" style={{ color: '#b8b3a7' }}>
        {label}
      </label>
      <div
        className="px-4 py-3 rounded-lg transition-colors focus-within:border-[rgba(236,230,216,0.5)]"
        style={{
          border: '1px solid rgba(236,230,216,0.20)',
          backgroundColor: 'rgba(255,255,255,0.02)',
        }}
      >
        {children}
      </div>
      {hint && <p className="text-[11px] mt-1" style={{ color: '#8a857a' }}>{hint}</p>}
    </div>
  );
}
