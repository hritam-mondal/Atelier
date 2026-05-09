import type { Course } from './cource';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string; // ISO
  title: string;
  body: string;
  helpfulCount: number;
  isVerifiedPurchase: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface RatingBreakdownItem {
  stars: number;
  percent: number;
}

export interface CourseDetail extends Course {
  subtitle: string;
  category: string;
  subcategory: string;
  shortDescription: string;
  longDescription: string; // markdown-ish
  whatYouWillLearn: string[];
  requirements: string[];
  targetAudience: string[];
  previewVideoUrl: string;
  previewThumbnail: string;
  price: number;
  discountPrice?: number;
  discountEndsAt?: string; // ISO
  ratingsBreakdown: RatingBreakdownItem[];
  reviews: Review[];
  faqs: FAQItem[];
  features: string[];
  relatedCourseIds: string[];
  instructorBio: {
    headline: string;
    body: string;
    totalStudents: number;
    totalReviews: number;
    totalCourses: number;
    avgRating: number;
  };
  resourceCount: number;
  exerciseCount: number;
}

export type ReviewSort = 'most-helpful' | 'most-recent' | 'highest' | 'lowest';
