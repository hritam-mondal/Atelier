import { PasswordChangeForm } from './PasswordChangeForm';
import { TwoFactorSetup } from './TwoFactorSetup';
import { SessionsTable } from './SessionsTable';
import { SecurityLog } from './SecurityLog';

export function SecurityPage() {
  return (
    <div className="space-y-12">
      <Section title="Password" description="Use a strong, unique password.">
        <PasswordChangeForm />
      </Section>
      <Section title="Two-factor authentication" description="Require a second factor when signing in.">
        <TwoFactorSetup />
      </Section>
      <Section title="Active sessions" description="Devices currently signed in to your account.">
        <SessionsTable />
      </Section>
      <Section title="Security log" description="Recent security-related events on your account.">
        <SecurityLog />
      </Section>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display tracking-tight text-xl mb-1" style={{ color: '#ece6d8' }}>{title}</h2>
      {description && <p className="text-xs mb-4" style={{ color: '#b8b3a7' }}>{description}</p>}
      {children}
    </section>
  );
}
