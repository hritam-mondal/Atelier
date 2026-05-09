export type CourseDraftStatus = 'draft' | 'in_review' | 'published' | 'archived';

export interface SectionDraft {
  id: string;
  title: string;
  lectures: LectureDraft[];
}

export interface LectureDraft {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  durationSeconds?: number;
  isFreePreview: boolean;
}

export interface CourseDraft {
  id: string;
  status: CourseDraftStatus;
  title: string;
  subtitle: string;
  thumbnail?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  language: string;
  whatYouLearn: string[];
  requirements: string[];
  longDescription: string;
  price: number;
  enrollments: number;
  rating: number;
  reviewCount: number;
  revenueLifetime: number;
  sections: SectionDraft[];
  publishedAt?: string;
  lastUpdatedAt: string;
}

export interface InstructorStats {
  totalStudents: number;
  monthlyRevenue: number;
  lifetimeRevenue: number;
  pendingPayout: number;
  avgRating: number;
  unansweredQuestions: number;
  enrollmentsLast30: { date: string; count: number }[];
  revenueLast12Months: { month: string; amount: number }[];
}

export interface PayoutEntry {
  id: string;
  amount: number;
  paidAt: string;
  method: 'stripe' | 'paypal';
}

export interface InstructorState {
  drafts: CourseDraft[];
  stats: InstructorStats;
  payouts: PayoutEntry[];
}

export type InstructorAction =
  | { type: 'CREATE_DRAFT'; draft: CourseDraft }
  | { type: 'UPDATE_DRAFT'; id: string; patch: Partial<CourseDraft> }
  | { type: 'PUBLISH_DRAFT'; id: string }
  | { type: 'ARCHIVE_DRAFT'; id: string }
  | { type: 'ADD_SECTION'; draftId: string; title: string }
  | { type: 'UPDATE_SECTION'; draftId: string; sectionId: string; patch: Partial<SectionDraft> }
  | { type: 'REMOVE_SECTION'; draftId: string; sectionId: string }
  | { type: 'REORDER_SECTIONS'; draftId: string; orderedIds: string[] }
  | { type: 'ADD_LECTURE'; draftId: string; sectionId: string; title: string }
  | { type: 'UPDATE_LECTURE'; draftId: string; sectionId: string; lectureId: string; patch: Partial<LectureDraft> }
  | { type: 'REMOVE_LECTURE'; draftId: string; sectionId: string; lectureId: string }
  | { type: 'HYDRATE'; state: Partial<InstructorState> };
