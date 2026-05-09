import { Trophy } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { CertificateCard } from './CertificateCard';
import { EmptyTabState } from './EmptyTabState';
import rawCatalog from '../../data/mockCatalog.json';
import type { CatalogCourse } from '../../types/catalog';

const allCourses = rawCatalog as CatalogCourse[];

export function CertificatesGrid() {
  const { state } = useUser();

  if (state.certificates.length === 0) {
    return (
      <div role="tabpanel" id="tab-panel-certificates" aria-labelledby="tab-certificates">
        <EmptyTabState
          icon={Trophy}
          title="No certificates yet"
          description="Complete a course to earn your first certificate. They look great on LinkedIn."
          cta={{ label: 'Browse my courses', to: '?tab=in-progress' }}
        />
      </div>
    );
  }

  return (
    <div
      role="tabpanel"
      id="tab-panel-certificates"
      aria-labelledby="tab-certificates"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
    >
      {state.certificates.map(cert => {
        const course = allCourses.find(c => c.id === cert.courseId);
        if (!course) return null;
        return <CertificateCard key={cert.id} certificate={cert} course={course} />;
      })}
    </div>
  );
}
