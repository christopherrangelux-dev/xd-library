import { Search, Library, Inbox, FolderTree, Plus } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  currentView: 'library' | 'vault' | 'queue';
  onViewChange: (view: 'library' | 'vault' | 'queue') => void;
  onOpenSubmission: () => void;
  isManager: boolean;
}

export function Header({
  searchTerm,
  onSearchChange,
  currentView,
  onViewChange,
  onOpenSubmission,
  isManager,
}: HeaderProps) {
  const navButtonClass = (isActive: boolean) =>
    `px-4 h-9 rounded-lg transition-colors flex items-center gap-2 flex-shrink-0 ${
      isActive
        ? 'bg-primary text-primary-foreground'
        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
    }`;

  const navButtons = (
    <>
      <button onClick={() => onViewChange('library')} className={navButtonClass(currentView === 'library')}>
        <Library className="w-4 h-4" />
        Library
      </button>
      <button onClick={() => onViewChange('vault')} className={navButtonClass(currentView === 'vault')}>
        <FolderTree className="w-4 h-4" />
        Process Vault
      </button>
      {isManager && (
        <button onClick={() => onViewChange('queue')} className={navButtonClass(currentView === 'queue')}>
          <Inbox className="w-4 h-4" />
          Approval Queue
        </button>
      )}
    </>
  );

  const searchInput = (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full h-9 pl-9 pr-3 bg-input-background border border-border rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
      />
    </div>
  );

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-8 py-4">
        <div className="flex items-center justify-between gap-3 sm:gap-8">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground">XD</span>
            </div>
            <div className="min-w-0 truncate">
              <h1 className="text-foreground truncate">XD Library</h1>
              <p className="text-[12px] text-muted-foreground truncate">Resource Hub</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3">{navButtons}</div>

          <div className="flex items-center gap-3">
            {currentView === 'library' && <div className="hidden lg:block w-64">{searchInput}</div>}
            <button
              onClick={onOpenSubmission}
              className="px-3 sm:px-4 h-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2 flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Submit Resource</span>
            </button>
          </div>
        </div>

        {/* Mobile nav tabs */}
        <div className="flex lg:hidden items-center gap-2 mt-3 overflow-x-auto pb-1">{navButtons}</div>

        {/* Mobile search */}
        {currentView === 'library' && <div className="lg:hidden mt-3">{searchInput}</div>}
      </div>
    </header>
  );
}
