import { X } from 'lucide-react';
import { Discipline, ResourceType, Filters } from '../hooks/useResources';

interface SidebarProps {
  filters: Filters;
  onToggleDiscipline: (discipline: Discipline) => void;
  onToggleResourceType: (type: ResourceType) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const disciplines: Discipline[] = ['UX', 'Design', 'Research', 'Strategy', 'Content'];
const resourceTypes: ResourceType[] = ['Template', 'Guide', 'Tool', 'Asset'];

export function Sidebar({
  filters,
  onToggleDiscipline,
  onToggleResourceType,
  onClearFilters,
  isOpen,
  onClose,
}: SidebarProps) {
  const hasActiveFilters =
    filters.disciplines.length > 0 || filters.resourceTypes.length > 0;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[280px] bg-sidebar border-r border-sidebar-border overflow-y-auto transition-transform duration-200 lg:static lg:z-auto lg:h-full lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sidebar-foreground">Filters</h2>
            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={onClearFilters}
                  className="text-[12px] text-primary hover:text-primary/80 transition-colors"
                >
                  Clear All
                </button>
              )}
              <button onClick={onClose} className="lg:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground" aria-label="Close filters">
                <X className="w-5 h-5" />
              </button>
            </div>
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
    </>
  );
}
