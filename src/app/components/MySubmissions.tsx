import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Pencil,
  MessageSquare,
  Inbox as InboxIcon,
} from 'lucide-react';
import { Resource, AuditStatus } from '../hooks/useResources';

interface MySubmissionsProps {
  resources: Resource[];
  contributorName: string | null;
  onEditResubmit: (resource: Resource) => void;
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

function getLatestComment(resource: Resource): string | undefined {
  return [...(resource.auditTrail || [])]
    .reverse()
    .find((entry) => entry.comments)?.comments;
}

export function MySubmissions({
  resources,
  contributorName,
  onEditResubmit,
}: MySubmissionsProps) {
  if (!contributorName) {
    return (
      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center justify-center py-24 px-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <InboxIcon className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-foreground mb-2">No Submissions Yet</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Submit a resource to see its status here.
          </p>
        </div>
      </main>
    );
  }

  const mySubmissions = resources.filter(
    (r) => r.contributorName === contributorName
  );

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-8">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-border">
            <h2 className="text-foreground mb-1">My Submissions</h2>
            <p className="text-[14px] text-muted-foreground">
              {mySubmissions.length}{' '}
              {mySubmissions.length === 1 ? 'submission' : 'submissions'} from{' '}
              {contributorName}
            </p>
          </div>

          <table className="hidden md:table w-full">
            <thead className="bg-muted sticky top-0">
              <tr>
                <th className="text-left px-6 py-3 text-[12px] text-muted-foreground">
                  Asset Title
                </th>
                <th className="text-left px-6 py-3 text-[12px] text-muted-foreground">
                  Date Submitted
                </th>
                <th className="text-left px-6 py-3 text-[12px] text-muted-foreground">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-[12px] text-muted-foreground">
                  Manager Comments
                </th>
                <th className="text-right px-6 py-3 text-[12px] text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mySubmissions.map((resource) => {
                const latestComment =
                  resource.auditStatus === 'Flagged'
                    ? getLatestComment(resource)
                    : undefined;

                return (
                  <tr
                    key={resource.id}
                    className="border-t border-border"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-foreground mb-1">
                          {resource.title}
                        </div>
                        <div className="text-[12px] text-muted-foreground">
                          {resource.discipline} • {resource.resourceType}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-muted-foreground">
                      {resource.dateSubmitted || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(resource.auditStatus)}
                    </td>
                    <td className="px-6 py-4 text-[14px] text-muted-foreground max-w-xs">
                      {latestComment ? (
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          <span>{latestComment}</span>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {resource.auditStatus === 'Flagged' && (
                        <button
                          onClick={() => onEditResubmit(resource)}
                          className="inline-flex items-center gap-2 px-3 h-8 rounded text-[14px] bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit & Resubmit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="md:hidden divide-y divide-border">
            {mySubmissions.map((resource) => {
              const latestComment =
                resource.auditStatus === 'Flagged'
                  ? getLatestComment(resource)
                  : undefined;

              return (
                <div key={resource.id} className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="text-foreground">{resource.title}</div>
                    {getStatusBadge(resource.auditStatus)}
                  </div>
                  <div className="text-[12px] text-muted-foreground mb-2">
                    {resource.discipline} • {resource.resourceType}
                  </div>
                  <div className="text-[14px] text-muted-foreground mb-3">
                    Submitted {resource.dateSubmitted || 'N/A'}
                  </div>
                  {latestComment && (
                    <div className="flex items-start gap-2 text-[14px] text-muted-foreground mb-3 p-3 bg-muted rounded-lg">
                      <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>{latestComment}</span>
                    </div>
                  )}
                  {resource.auditStatus === 'Flagged' && (
                    <button
                      onClick={() => onEditResubmit(resource)}
                      className="inline-flex items-center gap-2 px-3 h-8 rounded text-[14px] bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit & Resubmit
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
