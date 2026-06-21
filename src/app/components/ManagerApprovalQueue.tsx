import { useState } from 'react';
import { Resource } from '../hooks/useResources';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Calendar,
  User,
} from 'lucide-react';

interface ManagerApprovalQueueProps {
  pendingResources: Resource[];
  onVerify: (id: string) => void;
  onReject: (id: string, comments: string) => void;
}

export function ManagerApprovalQueue({
  pendingResources,
  onVerify,
  onReject,
}: ManagerApprovalQueueProps) {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [rejectComments, setRejectComments] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredSubmissions =
    filterStatus === 'All'
      ? pendingResources
      : pendingResources.filter((r) => r.auditStatus === filterStatus);

  const getStatusBadge = (status: string) => {
    const badges = {
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
    };

    const badge = badges[status as keyof typeof badges] || badges.Pending;
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-[11px] ${badge.bg} ${badge.border} ${badge.text}`}
      >
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const handleVerify = () => {
    if (selectedResource) {
      onVerify(selectedResource.id);
      setSelectedResource(null);
    }
  };

  const handleReject = () => {
    if (selectedResource && rejectComments.trim()) {
      onReject(selectedResource.id, rejectComments);
      setSelectedResource(null);
      setRejectComments('');
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-4 sm:p-8 overflow-y-auto lg:overflow-hidden min-w-0">
      <div className="flex-1 bg-card border border-border rounded-xl lg:overflow-hidden flex flex-col min-w-0">
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h2 className="text-foreground mb-1">Approval Queue</h2>
              <p className="text-[14px] text-muted-foreground">
                {filteredSubmissions.length} submissions awaiting review
              </p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['All', 'Pending', 'Reviewing', 'Flagged'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 h-8 rounded text-[14px] transition-colors flex-shrink-0 ${
                    filterStatus === status
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:flex-1 lg:overflow-y-auto">
          <table className="hidden md:table w-full">
            <thead className="bg-muted sticky top-0">
              <tr>
                <th className="text-left px-6 py-3 text-[12px] text-muted-foreground">
                  Asset Title
                </th>
                <th className="text-left px-6 py-3 text-[12px] text-muted-foreground">
                  Submitted By
                </th>
                <th className="text-left px-6 py-3 text-[12px] text-muted-foreground">
                  Date
                </th>
                <th className="text-left px-6 py-3 text-[12px] text-muted-foreground">
                  Status
                </th>
                <th className="text-right px-6 py-3 text-[12px] text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((resource) => (
                <tr
                  key={resource.id}
                  onClick={() => setSelectedResource(resource)}
                  className={`border-t border-border hover:bg-secondary/50 cursor-pointer transition-colors ${
                    selectedResource?.id === resource.id ? 'bg-accent' : ''
                  }`}
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
                  <td className="px-6 py-4 text-foreground">
                    {resource.contributorName || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-[14px] text-muted-foreground">
                    {resource.dateSubmitted || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(resource.auditStatus)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedResource(resource);
                      }}
                      className="px-3 h-8 rounded text-[14px] bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="md:hidden divide-y divide-border">
            {filteredSubmissions.map((resource) => (
              <div
                key={resource.id}
                onClick={() => setSelectedResource(resource)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedResource?.id === resource.id ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="text-foreground">{resource.title}</div>
                  {getStatusBadge(resource.auditStatus)}
                </div>
                <div className="text-[12px] text-muted-foreground mb-2">
                  {resource.discipline} • {resource.resourceType}
                </div>
                <div className="text-[14px] text-muted-foreground mb-3">
                  {resource.contributorName || 'Unknown'} · {resource.dateSubmitted || 'N/A'}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedResource(resource);
                  }}
                  className="px-3 h-8 rounded text-[14px] bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Review
                </button>
              </div>
            ))}
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <CheckCircle2 className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                No submissions match your filter
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedResource && (
        <div className="w-full lg:w-[400px] bg-card border border-border rounded-xl overflow-hidden flex flex-col flex-shrink-0 min-w-0">
          <div className="p-6 border-b border-border">
            <h3 className="text-foreground mb-2">Review Submission</h3>
            <p className="text-[12px] text-muted-foreground">
              ID: {selectedResource.id}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
              <img
                src={selectedResource.imageUrl}
                alt={selectedResource.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h4 className="text-foreground mb-2">{selectedResource.title}</h4>
              <p className="text-[14px] text-muted-foreground">
                {selectedResource.description}
              </p>
            </div>

            <div className="space-y-3 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-[14px] text-foreground">
                  {selectedResource.contributorName || 'Unknown Contributor'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-[14px] text-foreground">
                  {selectedResource.dateSubmitted || 'Date unknown'}
                </span>
              </div>
            </div>

            <div>
              <h5 className="text-foreground mb-2">Taxonomy</h5>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-[12px]">
                  {selectedResource.discipline}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-[12px]">
                  {selectedResource.resourceType}
                </span>
                {selectedResource.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-[12px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {selectedResource.url && (
              <div>
                <h5 className="text-foreground mb-2">Resource URL</h5>
                <a
                  href={selectedResource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-[14px] text-primary hover:underline break-all"
                >
                  <ExternalLink className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {selectedResource.url}
                </a>
              </div>
            )}

            <div>
              <h5 className="text-foreground mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Manager Comments
              </h5>
              <textarea
                value={rejectComments}
                onChange={(e) => setRejectComments(e.target.value)}
                placeholder="Add comments for rejection or clarification requests..."
                className="w-full h-24 px-3 py-2 bg-input-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>

          <div className="p-6 border-t border-border space-y-3">
            <button
              onClick={handleVerify}
              className="w-full h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Verify & Publish
            </button>
            <button
              onClick={handleReject}
              disabled={!rejectComments.trim()}
              className="w-full h-11 rounded-lg border border-border hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              Request Clarification
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
