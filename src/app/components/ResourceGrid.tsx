import { Resource, UserRole } from '../hooks/useResources';
import { ResourceCard } from './ResourceCard';

interface ResourceGridProps {
  resources: Resource[];
  userRole: UserRole;
}

export function ResourceGrid({ resources, userRole }: ResourceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} userRole={userRole} />
      ))}
    </div>
  );
}
