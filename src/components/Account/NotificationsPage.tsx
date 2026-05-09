import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDirtyForm } from '../../hooks/useDirtyForm';
import { eventDescriptions } from '../../data/mockAccount';
import { SaveBar } from './SaveBar';
import type { NotificationPrefs, NotificationEventKey } from '../../types/account';

export function NotificationsPage() {
  const { state, dispatch } = useAuth();
  const { value, setValue, dirty, reset, setBaseline } = useDirtyForm<NotificationPrefs>(state.notificationPrefs);
  const [saving, setSaving] = useState(false);

  const onSave = () => {
    setSaving(true);
    setTimeout(() => {
      dispatch({ type: 'UPDATE_NOTIFICATION_PREFS', prefs: value });
      setBaseline(value);
      setSaving(false);
    }, 400);
  };

  const toggle = (key: NotificationEventKey, channel: 'inApp' | 'email' | 'push') => {
    setValue({
      ...value,
      events: {
        ...value.events,
        [key]: { ...value.events[key], [channel]: !value.events[key][channel] },
      },
    });
  };

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display tracking-tight text-xl mb-1" style={{ color: '#ece6d8' }}>
          Email digest
        </h2>
        <p className="text-xs mb-4" style={{ color: '#b8b3a7' }}>
          Get a summary of your week's progress and what's new.
        </p>
        <div className="flex gap-2">
          {(['off', 'daily', 'weekly'] as const).map(freq => (
            <button
              key={freq}
              onClick={() => setValue({ ...value, digestFrequency: freq })}
              className="px-4 py-1.5 rounded-full text-sm transition-colors capitalize"
              style={
                value.digestFrequency === freq
                  ? { backgroundColor: '#ece6d8', color: '#15171a' }
                  : { border: '1px solid rgba(236,230,216,0.20)', color: '#b8b3a7' }
              }
            >
              {freq}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display tracking-tight text-xl mb-1" style={{ color: '#ece6d8' }}>
          Notifications by event
        </h2>
        <p className="text-xs mb-5" style={{ color: '#b8b3a7' }}>
          Choose which channels deliver each kind of notification.
        </p>

        <div
          className="rounded-xl overflow-x-auto"
          style={{ border: '1px solid rgba(236,230,216,0.10)' }}
        >
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="border-b" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
                <th className="text-left p-4 text-[11px] tracking-[0.18em] uppercase font-normal" style={{ color: '#8a857a' }}>Event</th>
                <th className="p-4 text-[11px] tracking-[0.18em] uppercase font-normal w-20 text-center" style={{ color: '#8a857a' }}>In-app</th>
                <th className="p-4 text-[11px] tracking-[0.18em] uppercase font-normal w-20 text-center" style={{ color: '#8a857a' }}>Email</th>
                <th className="p-4 text-[11px] tracking-[0.18em] uppercase font-normal w-20 text-center" style={{ color: '#8a857a' }}>Push</th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(value.events) as NotificationEventKey[]).map((key, i, arr) => {
                const desc = eventDescriptions[key];
                const prefs = value.events[key];
                return (
                  <tr
                    key={key}
                    className={i < arr.length - 1 ? 'border-b' : ''}
                    style={{ borderColor: 'rgba(236,230,216,0.08)' }}
                  >
                    <td className="p-4">
                      <p style={{ color: '#ece6d8' }}>{desc.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#8a857a' }}>{desc.description}</p>
                    </td>
                    {(['inApp', 'email', 'push'] as const).map(ch => (
                      <td key={ch} className="p-4 text-center">
                        <label className="inline-flex cursor-pointer">
                          <input
                            type="checkbox"
                            role="switch"
                            checked={prefs[ch]}
                            onChange={() => toggle(key, ch)}
                            aria-label={`${desc.label} ${ch}`}
                            className="sr-only peer"
                          />
                          <span
                            className="relative inline-block w-9 h-5 rounded-full transition-colors"
                            style={{ backgroundColor: prefs[ch] ? '#ece6d8' : 'rgba(236,230,216,0.15)' }}
                          >
                            <span
                              className="absolute top-0.5 w-4 h-4 rounded-full transition-transform"
                              style={{
                                backgroundColor: prefs[ch] ? '#15171a' : '#ece6d8',
                                left: prefs[ch] ? '18px' : '2px',
                              }}
                            />
                          </span>
                        </label>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-display tracking-tight text-xl mb-3" style={{ color: '#ece6d8' }}>
          Marketing
        </h2>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={value.marketing}
            onChange={e => setValue({ ...value, marketing: e.target.checked })}
            className="mt-1 accent-[#ece6d8]"
          />
          <span className="text-sm" style={{ color: '#ece6d8' }}>
            Send me occasional product updates and learning tips.
            <span className="block text-xs mt-0.5" style={{ color: '#8a857a' }}>
              At most once a month. Unsubscribe any time.
            </span>
          </span>
        </label>
      </section>

      <SaveBar visible={dirty} onSave={onSave} onDiscard={reset} saving={saving} />
    </div>
  );
}
