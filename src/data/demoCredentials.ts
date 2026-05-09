import type { UserRole } from '../types/account';

export interface DemoCredential {
  email: string;
  password: string;
  role: UserRole;
  label: string;
  description: string;
}

export const DEMO_PASSWORD = 'atelier2025';

export const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    email: 'student@atelier.app',
    password: DEMO_PASSWORD,
    role: 'student',
    label: 'Student',
    description: 'My Learning, Cart, Notes, Q&A',
  },
  {
    email: 'instructor@atelier.app',
    password: DEMO_PASSWORD,
    role: 'instructor',
    label: 'Instructor',
    description: 'Studio, course editor, earnings, Q&A inbox',
  },
  {
    email: 'admin@atelier.app',
    password: DEMO_PASSWORD,
    role: 'admin',
    label: 'Admin',
    description: 'Moderation, feature flags, audit log',
  },
];

export function findCredential(email: string, password: string): DemoCredential | null {
  const e = email.trim().toLowerCase();
  return DEMO_CREDENTIALS.find(c => c.email === e && c.password === password) ?? null;
}
