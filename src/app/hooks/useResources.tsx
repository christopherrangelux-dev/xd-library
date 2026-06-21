import { useState, useMemo } from 'react';

export type AuditStatus = 'Pending' | 'Verified' | 'Deprecated' | 'Reviewing' | 'Flagged';
export type UserRole = 'Manager' | 'Associate';
export type ResourceType = 'Template' | 'Guide' | 'Tool' | 'Asset';
export type Discipline = 'UX' | 'Design' | 'Research' | 'Strategy' | 'Content';

export interface AuditTrailEntry {
  date: string;
  action: string;
  userId: string;
  userName: string;
  comments?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  tags: string[];
  resourceType: ResourceType;
  discipline: Discipline;
  lastVerified: string;
  auditStatus: AuditStatus;
  imageUrl: string;
  downloadUrl?: string;
  contributorId?: string;
  contributorName?: string;
  dateSubmitted?: string;
  auditTrail?: AuditTrailEntry[];
  url?: string;
}

export interface Filters {
  disciplines: Discipline[];
  resourceTypes: ResourceType[];
}

export function useResources(initialResources: Resource[], userRole: UserRole) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    disciplines: [],
    resourceTypes: [],
  });

  const filteredResources = useMemo(() => {
    return initialResources.filter((resource) => {
      const matchesSearch =
        searchTerm.length < 2 ||
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesDiscipline =
        filters.disciplines.length === 0 ||
        filters.disciplines.includes(resource.discipline);

      const matchesType =
        filters.resourceTypes.length === 0 ||
        filters.resourceTypes.includes(resource.resourceType);

      return matchesSearch && matchesDiscipline && matchesType;
    });
  }, [initialResources, searchTerm, filters]);

  const toggleDiscipline = (discipline: Discipline) => {
    setFilters((prev) => ({
      ...prev,
      disciplines: prev.disciplines.includes(discipline)
        ? prev.disciplines.filter((d) => d !== discipline)
        : [...prev.disciplines, discipline],
    }));
  };

  const toggleResourceType = (type: ResourceType) => {
    setFilters((prev) => ({
      ...prev,
      resourceTypes: prev.resourceTypes.includes(type)
        ? prev.resourceTypes.filter((t) => t !== type)
        : [...prev.resourceTypes, type],
    }));
  };

  const clearFilters = () => {
    setFilters({ disciplines: [], resourceTypes: [] });
    setSearchTerm('');
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    toggleDiscipline,
    toggleResourceType,
    clearFilters,
    filteredResources,
    userRole,
  };
}
