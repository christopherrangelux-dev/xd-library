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
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="mx-auto px-8 py-4">
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground">XD</span>
            </div>
            <div>
              <h1 className="text-foreground">XD Library</h1>
              <p className="text-[12px] text-muted-foreground">Resource Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onViewChange('library')}
              className={`px-4 h-9 rounded-lg transition-colors flex items-center gap-2 ${
                currentView === 'library'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <Library className="w-4 h-4" />
              Library
            </button>
            <button
              onClick={() => onViewChange('vault')}
              className={`px-4 h-9 rounded-lg transition-colors flex items-center gap-2 ${
                currentView === 'vault'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              Process Vault
            </button>
            {isManager && (
              <button
                onClick={() => onViewChange('queue')}
                className={`px-4 h-9 rounded-lg transition-colors flex items-center gap-2 ${
                  currentView === 'queue'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                <Inbox className="w-4 h-4" />
                Approval Queue
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentView === 'library' && (
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 bg-input-background border border-border rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
              </div>
            )}
            <button
              onClick={onOpenSubmission}
              className="px-4 h-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Submit Resource
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
