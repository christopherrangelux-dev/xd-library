import { Discipline, ResourceType, Filters } from '../hooks/useResources';

interface SidebarProps {
  filters: Filters;
  onToggleDiscipline: (discipline: Discipline) => void;
  onToggleResourceType: (type: ResourceType) => void;
  onClearFilters: () => void;
}

const disciplines: Discipline[] = ['UX', 'Design', 'Research', 'Strategy', 'Content'];
const resourceTypes: ResourceType[] = ['Template', 'Guide', 'Tool', 'Asset'];

export function Sidebar({
  filters,
  onToggleDiscipline,
  onToggleResourceType,
  onClearFilters,
}: SidebarProps) {
  const hasActiveFilters =
    filters.disciplines.length > 0 || filters.resourceTypes.length > 0;

  return (
    <aside className="w-[280px] bg-sidebar border-r border-sidebar-border h-full overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sidebar-foreground">Filters</h2>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-[12px] text-primary hover:text-primary/80 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sidebar-foreground mb-3">Discipline</h3>
            <div className="space-y-2">
              {disciplines.map((discipline) => (
                <label
                  key={discipline}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.disciplines.includes(discipline)}
                    onChange={() => onToggleDiscipline(discipline)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring cursor-pointer"
                  />
                  <span className="text-sidebar-foreground group-hover:text-sidebar-primary transition-colors">
                    {discipline}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-sidebar-border pt-6">
            <h3 className="text-sidebar-foreground mb-3">Resource Type</h3>
            <div className="space-y-2">
              {resourceTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.resourceTypes.includes(type)}
                    onChange={() => onToggleResourceType(type)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring cursor-pointer"
                  />
                  <span className="text-sidebar-foreground group-hover:text-sidebar-primary transition-colors">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
