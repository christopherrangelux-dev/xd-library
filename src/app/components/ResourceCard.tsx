import { Download, ExternalLink, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Resource, UserRole } from '../hooks/useResources';

interface ResourceCardProps {
  resource: Resource;
  userRole: UserRole;
}

export function ResourceCard({ resource, userRole }: ResourceCardProps) {
  const isManager = userRole === 'Manager';

  const getAuditBadge = () => {
    if (!isManager) return null;

    switch (resource.auditStatus) {
      case 'Pending':
        return (
          <div className="absolute top-3 right-3 px-2 py-1 rounded bg-warning-bg border border-warning-yellow flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-warning-yellow" />
            <span className="text-[11px] text-slate-800">Pending Audit</span>
          </div>
        );
      case 'Verified':
        return (
          <div className="absolute top-3 right-3 px-2 py-1 rounded bg-accent border border-primary flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-primary" />
            <span className="text-[11px] text-primary">Verified</span>
          </div>
        );
      case 'Deprecated':
        return (
          <div className="absolute top-3 right-3 px-2 py-1 rounded bg-destructive/10 border border-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-destructive" />
            <span className="text-[11px] text-destructive">Deprecated</span>
          </div>
        );
    }
  };

  const getCategoryColor = (type: string) => {
    const colors = {
      Template: 'bg-blue-100 text-blue-700 border-blue-200',
      Guide: 'bg-green-100 text-green-700 border-green-200',
      Tool: 'bg-purple-100 text-purple-700 border-purple-200',
      Asset: 'bg-orange-100 text-orange-700 border-orange-200',
    };
    return colors[type as keyof typeof colors] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
      <div className="relative aspect-video bg-slate-100 overflow-hidden">
        <img
          src={resource.imageUrl}
          alt={resource.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {getAuditBadge()}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div
            className={`px-2 py-1 rounded text-[11px] border ${getCategoryColor(
              resource.resourceType
            )}`}
          >
            {resource.resourceType}
          </div>
          <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{resource.lastVerified}</span>
          </div>
        </div>

        <h3 className="text-card-foreground mb-2 line-clamp-2 min-h-[3rem]">
          {resource.title}
        </h3>

        <p className="text-[14px] text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">
          {resource.description}
        </p>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {resource.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-[11px]"
            >
              {tag}
            </span>
          ))}
          {resource.tags.length > 2 && (
            <span className="text-[11px] text-muted-foreground">
              +{resource.tags.length - 2} more
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            <ExternalLink className="w-4 h-4" />
            <span>View</span>
          </button>
          {resource.downloadUrl && (
            <button className="h-9 px-3 rounded-lg border border-border hover:bg-secondary transition-colors flex items-center justify-center">
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
