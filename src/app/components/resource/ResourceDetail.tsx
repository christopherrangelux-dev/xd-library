import {
  ArrowLeft,
  Download,
  ExternalLink,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  User,
  Calendar,
  History,
} from 'lucide-react';
import { Resource, UserRole, AuditStatus } from '../../hooks/useResources';
import { getCategoryColor } from '../ResourceCard';

interface ResourceDetailProps {
  resource: Resource;
  userRole: UserRole;
  onBack: () => void;
}

const statusBadges: Record<
  AuditStatus,
  { bg: string; border: string; text: string; icon: typeof Clock }
> = {
  Pending: {
    bg: 'bg-warning-bg',
    border: 'border-warning-yellow',
    text: 'text-slate-800',
    icon: Clock,
  },
  Reviewing: {
    bg: 'bg-blue-50',
    border: 'border-blue-500',
    text: 'text-blue-700',
    icon: AlertCircle,
  },
  Verified: {
    bg: 'bg-green-50',
    border: 'border-green-500',
    text: 'text-green-700',
    icon: CheckCircle2,
  },
  Flagged: {
    bg: 'bg-red-50',
    border: 'border-red-500',
    text: 'text-red-700',
    icon: XCircle,
  },
  Deprecated: {
    bg: 'bg-destructive/10',
    border: 'border-destructive',
    text: 'text-destructive',
    icon: AlertCircle,
  },
};

function getStatusBadge(status: AuditStatus) {
  const badge = statusBadges[status] || statusBadges.Pending;
  const Icon = badge.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-[11px] ${badge.bg} ${badge.border} ${badge.text}`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

export function ResourceDetail({ resource, userRole, onBack }: ResourceDetailProps) {
  // userRole is accepted now for a future manager-only action; unused for now.
  void userRole;

  const auditTrail = resource.auditTrail || [];

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-8 max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-4 sm:mb-6 inline-flex items-center gap-2 text-[14px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </button>

        <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
          <div className="aspect-video bg-slate-100 overflow-hidden">
            <img
              src={resource.imageUrl}
              alt={resource.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <div
                    className={`px-2 py-1 rounded text-[11px] border ${getCategoryColor(
                      resource.resourceType
                    )}`}
                  >
                    {resource.resourceType}
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-[11px]">
                    {resource.discipline}
                  </span>
                  {getStatusBadge(resource.auditStatus)}
                </div>
                <h2 className="text-foreground mb-1">{resource.title}</h2>
                <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Last verified {resource.lastVerified}</span>
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                {resource.downloadUrl && (
                  <a
                    href={resource.downloadUrl}
                    className="h-10 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </a>
                )}
              </div>
            </div>

            <p className="text-[14px] text-foreground mb-4 whitespace-pre-wrap">
              {resource.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {resource.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-[11px]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {resource.url && (
              <div className="mb-4">
                <h5 className="text-foreground mb-2">Resource URL</h5>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-[14px] text-primary hover:underline break-all"
                >
                  <ExternalLink className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {resource.url}
                </a>
              </div>
            )}

            {(resource.contributorName || resource.dateSubmitted) && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6 p-4 bg-muted rounded-lg">
                {resource.contributorName && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[14px] text-foreground">
                      {resource.contributorName}
                    </span>
                  </div>
                )}
                {resource.dateSubmitted && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[14px] text-foreground">
                      Submitted {resource.dateSubmitted}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
          <h3 className="text-foreground mb-4 flex items-center gap-2">
            <History className="w-4 h-4" />
            Audit History
          </h3>

          {auditTrail.length > 0 ? (
            <ul className="space-y-4">
              {auditTrail.map((entry, index) => (
                <li
                  key={index}
                  className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4 pb-4 border-b border-border last:border-b-0 last:pb-0"
                >
                  <div className="text-[12px] text-muted-foreground sm:w-32 flex-shrink-0">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14px] text-foreground">
                      {entry.action} &mdash; <span className="text-muted-foreground">{entry.userName}</span>
                    </div>
                    {entry.comments && (
                      <p className="text-[14px] text-muted-foreground mt-1">{entry.comments}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-[14px]">No review history yet</p>
          )}
        </div>
      </div>
    </main>
  );
}
