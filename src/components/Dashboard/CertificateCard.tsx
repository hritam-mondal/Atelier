import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Share2, ExternalLink, Copy, Check, Briefcase, MessageCircle, Link as LinkIcon, Award } from 'lucide-react';
import type { Certificate } from '../../types/dashboard';
import type { CatalogCourse } from '../../types/catalog';
import { useUser } from '../../context/UserContext';

interface Props {
  certificate: Certificate;
  course: CatalogCourse;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function CertificateCard({ certificate, course }: Props) {
  const { state } = useUser();
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shareOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setShareOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [shareOpen]);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(certificate.certificateNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* noop */ }
  };

  return (
    <div ref={ref} className="rounded-xl border border-white/10 overflow-hidden" style={{ backgroundColor: '#22252b' }}>
      {/* Faux certificate visual */}
      <div className="relative aspect-video">
        <svg
          viewBox="0 0 480 270"
          className="absolute inset-0 w-full h-full"
          aria-hidden
        >
          <defs>
            <linearGradient id={`cert-bg-${certificate.id}`} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#15171a" />
              <stop offset="100%" stopColor="#22252b" />
            </linearGradient>
            <linearGradient id={`cert-border-${certificate.id}`} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#ece6d8" />
              <stop offset="100%" stopColor="#d6cfbe" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="480" height="270" fill={`url(#cert-bg-${certificate.id})`} />
          <rect x="12" y="12" width="456" height="246" fill="none" stroke={`url(#cert-border-${certificate.id})`} strokeWidth="2" rx="6" />
          <rect x="20" y="20" width="440" height="230" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" rx="4" />

          {/* Header */}
          <text x="240" y="56" textAnchor="middle" fill="#ece6d8" fontSize="11" fontFamily="serif" letterSpacing="3">
            CERTIFICATE OF COMPLETION
          </text>
          <line x1="180" y1="68" x2="300" y2="68" stroke="rgba(236,230,216,0.4)" strokeWidth="0.5" />

          <text x="240" y="100" textAnchor="middle" fill="#b8b3a7" fontSize="10" fontFamily="serif" fontStyle="italic">
            This certifies that
          </text>
          <text x="240" y="130" textAnchor="middle" fill="white" fontSize="22" fontFamily="serif" fontWeight="bold">
            {state.user.name}
          </text>
          <line x1="120" y1="142" x2="360" y2="142" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />

          <text x="240" y="162" textAnchor="middle" fill="#ece6d8" fontSize="10" fontFamily="serif">
            has successfully completed
          </text>

          {/* Title — wrap manually if too long */}
          <text x="240" y="188" textAnchor="middle" fill="white" fontSize="14" fontFamily="serif" fontWeight="600">
            {course.title.length > 42 ? course.title.slice(0, 40) + '…' : course.title}
          </text>

          {/* Footer */}
          <text x="60" y="232" fill="#b8b3a7" fontSize="8" fontFamily="serif">
            ISSUED
          </text>
          <text x="60" y="245" fill="white" fontSize="10" fontFamily="serif">
            {formatDate(certificate.issuedAt)}
          </text>

          <text x="420" y="232" textAnchor="end" fill="#b8b3a7" fontSize="8" fontFamily="serif">
            INSTRUCTOR
          </text>
          <text x="420" y="245" textAnchor="end" fill="white" fontSize="10" fontFamily="serif" fontStyle="italic">
            {course.instructor.name}
          </text>

          {/* Seal */}
          <circle cx="240" cy="220" r="14" fill="none" stroke="rgba(236,230,216,0.6)" strokeWidth="1" />
          <circle cx="240" cy="220" r="9" fill="rgba(236,230,216,0.15)" />
        </svg>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-white truncate">{course.title}</h3>
        <p className="text-xs text-slate-400 mt-0.5">Issued: {formatDate(certificate.issuedAt)}</p>
        <button
          onClick={copyId}
          className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-mono"
          aria-label="Copy certificate ID"
        >
          {copied ? <Check size={11} className="text-emerald-400" aria-hidden /> : <Copy size={11} aria-hidden />}
          {certificate.certificateNumber}
        </button>

        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors"
          >
            <Download size={12} aria-hidden /> Download PDF
          </button>
          <div className="relative">
            <button
              onClick={() => setShareOpen(o => !o)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 text-white text-xs font-semibold hover:bg-white/5 transition-colors"
              aria-haspopup="menu"
              aria-expanded={shareOpen}
            >
              <Share2 size={12} aria-hidden /> Share
            </button>
            {shareOpen && (
              <div role="menu" className="absolute left-0 top-full mt-1 w-44 rounded-lg border border-white/10 shadow-2xl py-1 z-10" style={{ backgroundColor: '#22252b' }}>
                <ShareItem icon={<Briefcase size={13} className="text-sky-400" aria-hidden />} label="Share on LinkedIn" />
                <ShareItem icon={<MessageCircle size={13} className="text-sky-300" aria-hidden />} label="Share on X" />
                <ShareItem icon={<LinkIcon size={13} aria-hidden />} label="Copy link" />
              </div>
            )}
          </div>
          <Link
            to="/course"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 text-white text-xs font-semibold hover:bg-white/5 transition-colors"
          >
            <ExternalLink size={12} aria-hidden /> View course
          </Link>
        </div>
      </div>

      {/* Decorative ribbon */}
      <div className="hidden">
        <Award aria-hidden />
      </div>
    </div>
  );
}

function ShareItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      role="menuitem"
      className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-200 hover:bg-white/5 transition-colors"
    >
      {icon} {label}
    </button>
  );
}
