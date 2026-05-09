import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getQuizById } from '../../data/mockQuizzes';
import { AssessmentRunner } from './AssessmentRunner';

export function QuizPage() {
  const { quizId = '' } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const quiz = getQuizById(quizId);

  if (!quiz) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-3xl tracking-tight mb-4" style={{ color: '#ece6d8' }}>
          Quiz not found.
        </h1>
        <Link
          to="/learning"
          className="inline-flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity"
          style={{ color: '#ece6d8' }}
        >
          <ArrowLeft size={13} aria-hidden /> Back to learning
        </Link>
      </div>
    );
  }

  return <AssessmentRunner quiz={quiz} onExit={() => navigate('/player')} />;
}
