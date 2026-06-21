import { FileQuestion, Plus } from 'lucide-react';

interface EmptyStateProps {
  searchTerm: string;
}

export function EmptyState({ searchTerm }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <FileQuestion className="w-10 h-10 text-muted-foreground" />
      </div>

      <h3 className="text-foreground mb-2">No Resources Found</h3>

      {searchTerm ? (
        <p className="text-muted-foreground text-center mb-8 max-w-md">
          We couldn't find any resources matching "{searchTerm}". Try adjusting your
          search or filters.
        </p>
      ) : (
        <p className="text-muted-foreground text-center mb-8 max-w-md">
          No resources match your current filters. Try adjusting your selection.
        </p>
      )}

      <button className="h-11 px-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2">
        <Plus className="w-5 h-5" />
        <span>Request a Resource</span>
      </button>

      <p className="text-[12px] text-muted-foreground mt-4">
        Can't find what you're looking for? Submit a request to our team.
      </p>
    </div>
  );
}
