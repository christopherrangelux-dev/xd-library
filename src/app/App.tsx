import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ResourceGrid } from './components/ResourceGrid';
import { EmptyState } from './components/EmptyState';
import { ProcessVault } from './components/ProcessVault';
import { ManagerApprovalQueue } from './components/ManagerApprovalQueue';
import { SubmissionWizard, SubmissionData } from './components/SubmissionWizard';
import { ResourceDetail } from './components/resource/ResourceDetail';
import { useResources, Resource, UserRole } from './hooks/useResources';
import { Users, CheckCircle, SlidersHorizontal } from 'lucide-react';
import { toast, Toaster } from 'sonner';

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'UX Research Interview Template',
    description: 'Comprehensive template for conducting user interviews with pre-built questions and frameworks.',
    tags: ['Research', 'Interviews', 'User Testing'],
    resourceType: 'Template',
    discipline: 'Research',
    lastVerified: 'Apr 15, 2026',
    auditStatus: 'Verified',
    imageUrl: 'https://images.unsplash.com/photo-1723987251277-18fc0a1effd0?w=1080',
    downloadUrl: '#',
  },
  {
    id: '2',
    title: 'Design System Foundations Guide',
    description: 'Complete guide to building and maintaining scalable design systems with best practices.',
    tags: ['Design System', 'Foundations', 'Components'],
    resourceType: 'Guide',
    discipline: 'Design',
    lastVerified: 'Apr 10, 2026',
    auditStatus: 'Pending',
    imageUrl: 'https://images.unsplash.com/photo-1769149068959-b11392164add?w=1080',
    contributorName: 'Sarah Chen',
    contributorId: 'user-123',
    dateSubmitted: 'Apr 10, 2026',
    url: 'https://example.com/design-system-guide',
  },
  {
    id: '3',
    title: 'Wireframe Kit Pro',
    description: 'Professional wireframing toolkit with pre-made components for rapid prototyping.',
    tags: ['Wireframes', 'Prototyping', 'UI'],
    resourceType: 'Tool',
    discipline: 'UX',
    lastVerified: 'Apr 18, 2026',
    auditStatus: 'Verified',
    imageUrl: 'https://images.unsplash.com/photo-1642286941365-89da3e29c0a2?w=1080',
    downloadUrl: '#',
  },
  {
    id: '4',
    title: 'User Flow Templates',
    description: 'Collection of user flow diagrams for common design patterns and user journeys.',
    tags: ['User Flows', 'Diagrams', 'Mapping'],
    resourceType: 'Template',
    discipline: 'UX',
    lastVerified: 'Mar 28, 2026',
    auditStatus: 'Verified',
    imageUrl: 'https://images.unsplash.com/photo-1648134859179-5d6258f776af?w=1080',
    downloadUrl: '#',
  },
  {
    id: '5',
    title: 'Content Strategy Playbook',
    description: 'Strategic framework for developing and executing content strategies across channels.',
    tags: ['Content', 'Strategy', 'Planning'],
    resourceType: 'Guide',
    discipline: 'Content',
    lastVerified: 'Apr 12, 2026',
    auditStatus: 'Verified',
    imageUrl: 'https://images.unsplash.com/photo-1610569171388-dd6e3d27e340?w=1080',
  },
  {
    id: '6',
    title: 'Analytics Dashboard Template',
    description: 'Pre-configured analytics dashboard for tracking key UX metrics and user behavior.',
    tags: ['Analytics', 'Metrics', 'Dashboard'],
    resourceType: 'Tool',
    discipline: 'Research',
    lastVerified: 'Apr 5, 2026',
    auditStatus: 'Verified',
    imageUrl: 'https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?w=1080',
    downloadUrl: '#',
  },
  {
    id: '7',
    title: 'Brand Assets Library',
    description: 'Centralized repository of approved brand assets including logos, colors, and typography.',
    tags: ['Branding', 'Assets', 'Visual Identity'],
    resourceType: 'Asset',
    discipline: 'Design',
    lastVerified: 'Feb 20, 2026',
    auditStatus: 'Deprecated',
    imageUrl: 'https://images.unsplash.com/photo-1571573722006-d4fc4bca25d4?w=1080',
  },
  {
    id: '8',
    title: 'Mobile App Design Patterns',
    description: 'Comprehensive collection of mobile-first design patterns and best practices.',
    tags: ['Mobile', 'Patterns', 'UI'],
    resourceType: 'Guide',
    discipline: 'Design',
    lastVerified: 'Apr 14, 2026',
    auditStatus: 'Verified',
    imageUrl: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1080',
  },
  {
    id: '9',
    title: 'Accessibility Audit Checklist',
    description: 'Detailed checklist for conducting thorough accessibility audits on digital products.',
    tags: ['Accessibility', 'WCAG', 'Compliance'],
    resourceType: 'Template',
    discipline: 'UX',
    lastVerified: 'Apr 16, 2026',
    auditStatus: 'Verified',
    imageUrl: 'https://images.unsplash.com/photo-1618788372246-79faff0c3742?w=1080',
    downloadUrl: '#',
  },
  {
    id: '10',
    title: 'Customer Journey Mapping Tool',
    description: 'Interactive tool for creating and visualizing customer journey maps with team collaboration.',
    tags: ['Journey Maps', 'CX', 'Collaboration'],
    resourceType: 'Tool',
    discipline: 'Strategy',
    lastVerified: 'Apr 11, 2026',
    auditStatus: 'Reviewing',
    imageUrl: 'https://images.unsplash.com/photo-1761735485907-c59db6a69ccf?w=1080',
    contributorName: 'Mike Rodriguez',
    contributorId: 'user-456',
    dateSubmitted: 'Apr 11, 2026',
    url: 'https://example.com/journey-map-tool',
  },
  {
    id: '11',
    title: 'Design Workflow Automation',
    description: 'Automated workflows for streamlining design handoff and developer collaboration.',
    tags: ['Automation', 'Workflow', 'Handoff'],
    resourceType: 'Tool',
    discipline: 'Design',
    lastVerified: 'Apr 8, 2026',
    auditStatus: 'Verified',
    imageUrl: 'https://images.unsplash.com/photo-1648134859211-4a1b57575f4e?w=1080',
    downloadUrl: '#',
  },
  {
    id: '12',
    title: 'Content Audit Template',
    description: 'Structured template for conducting comprehensive content audits and inventories.',
    tags: ['Content Audit', 'IA', 'Documentation'],
    resourceType: 'Template',
    discipline: 'Content',
    lastVerified: 'Apr 9, 2026',
    auditStatus: 'Verified',
    imageUrl: 'https://images.unsplash.com/photo-1770681381576-f1fdceb2ea01?w=1080',
    downloadUrl: '#',
  },
  {
    id: '13',
    title: 'Usability Testing Scripts',
    description: 'Ready-to-use scripts and protocols for conducting effective usability testing sessions.',
    tags: ['Testing', 'Usability', 'Scripts'],
    resourceType: 'Template',
    discipline: 'Research',
    lastVerified: 'Apr 13, 2026',
    auditStatus: 'Verified',
    imageUrl: 'https://images.unsplash.com/photo-1763038311036-6d18805537e5?w=1080',
    downloadUrl: '#',
  },
  {
    id: '14',
    title: 'Strategic Planning Framework',
    description: 'Proven framework for developing and executing design strategy initiatives.',
    tags: ['Strategy', 'Planning', 'Framework'],
    resourceType: 'Guide',
    discipline: 'Strategy',
    lastVerified: 'Apr 7, 2026',
    auditStatus: 'Verified',
    imageUrl: 'https://images.unsplash.com/photo-1634084462412-b54873c0a56d?w=1080',
  },
  {
    id: '15',
    title: 'Icon Library Pack',
    description: 'Extensive library of customizable icons for web and mobile applications.',
    tags: ['Icons', 'UI Elements', 'Graphics'],
    resourceType: 'Asset',
    discipline: 'Design',
    lastVerified: 'Apr 17, 2026',
    auditStatus: 'Verified',
    imageUrl: 'https://images.unsplash.com/photo-1762690717850-d006c1416a15?w=1080',
    downloadUrl: '#',
  },
  {
    id: '16',
    title: 'Voice & Tone Guidelines',
    description: 'Comprehensive guidelines for maintaining consistent voice and tone across all content.',
    tags: ['Voice', 'Tone', 'Writing'],
    resourceType: 'Guide',
    discipline: 'Content',
    lastVerified: 'Apr 6, 2026',
    auditStatus: 'Flagged',
    imageUrl: 'https://images.unsplash.com/photo-1770153792570-fd188336199a?w=1080',
    contributorName: 'Jessica Park',
    contributorId: 'user-789',
    dateSubmitted: 'Apr 6, 2026',
    url: 'https://example.com/voice-tone-guide',
  },
];

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>('Associate');
  const [currentView, setCurrentView] = useState<'library' | 'vault' | 'queue'>('library');
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const {
    searchTerm,
    setSearchTerm,
    filters,
    toggleDiscipline,
    toggleResourceType,
    clearFilters,
    filteredResources,
  } = useResources(resources.filter((r) => r.auditStatus === 'Verified' || r.auditStatus === 'Deprecated'), userRole);

  const pendingResources = resources.filter(
    (r) => r.auditStatus === 'Pending' || r.auditStatus === 'Reviewing' || r.auditStatus === 'Flagged'
  );

  const handleSubmission = (data: SubmissionData) => {
    const newResource: Resource = {
      id: `new-${Date.now()}`,
      title: data.title,
      description: data.description,
      tags: data.tags,
      resourceType: data.resourceType as any,
      discipline: data.discipline as any,
      lastVerified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      auditStatus: 'Pending',
      imageUrl: 'https://images.unsplash.com/photo-1648134859179-5d6258f776af?w=1080',
      url: data.url,
      contributorName: data.contributorName,
      contributorId: 'current-user',
      dateSubmitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    setResources((prev) => [...prev, newResource]);
    toast.success('Resource submitted successfully! Awaiting review.', {
      duration: 4000,
    });
  };

  const handleVerify = (id: string) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, auditStatus: 'Verified' as const, lastVerified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
          : r
      )
    );
    toast.success('Resource verified and published!', {
      icon: <CheckCircle className="w-5 h-5" />,
      duration: 3000,
    });
  };

  const handleReject = (id: string, comments: string) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              auditStatus: 'Flagged' as const,
              auditTrail: [
                ...(r.auditTrail || []),
                {
                  date: new Date().toISOString(),
                  action: 'Clarification Requested',
                  userId: 'manager-1',
                  userName: 'Current Manager',
                  comments,
                },
              ],
            }
          : r
      )
    );
    toast.info('Clarification requested from contributor', {
      duration: 3000,
    });
  };

  return (
    <div className="size-full flex flex-col bg-background">
      <Toaster position="top-right" richColors />
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currentView={currentView}
        onViewChange={(view) => {
          setSelectedResource(null);
          setCurrentView(view);
        }}
        onOpenSubmission={() => setIsSubmissionOpen(true)}
        isManager={userRole === 'Manager'}
      />

      <div className="flex items-center justify-end px-4 sm:px-8 py-3 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[14px] text-muted-foreground">View Mode:</span>
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setUserRole('Associate')}
              className={`px-4 h-8 rounded text-[14px] transition-all ${
                userRole === 'Associate'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="inline w-4 h-4 mr-2" />
              Associate
            </button>
            <button
              onClick={() => setUserRole('Manager')}
              className={`px-4 h-8 rounded text-[14px] transition-all ${
                userRole === 'Manager'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="inline w-4 h-4 mr-2" />
              Manager
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {currentView === 'library' && selectedResource && (
          <ResourceDetail
            resource={
              resources.find((r) => r.id === selectedResource.id) || selectedResource
            }
            userRole={userRole}
            onBack={() => setSelectedResource(null)}
          />
        )}

        {currentView === 'library' && !selectedResource && (
          <>
            <Sidebar
              filters={filters}
              onToggleDiscipline={toggleDiscipline}
              onToggleResourceType={toggleResourceType}
              onClearFilters={clearFilters}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-8">
                <div className="mb-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden h-9 px-3 rounded-lg border border-border hover:bg-secondary transition-colors flex items-center gap-2 flex-shrink-0"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="text-[14px]">Filters</span>
                      </button>
                      <div>
                        <h2 className="text-foreground mb-1">Resource Library</h2>
                        <p className="text-muted-foreground">
                          {filteredResources.length}{' '}
                          {filteredResources.length === 1 ? 'resource' : 'resources'} available
                        </p>
                      </div>
                    </div>
                    {userRole === 'Manager' && (
                      <div className="flex flex-wrap gap-2 text-[12px]">
                        <div className="flex items-center gap-2 px-3 py-1 bg-accent border border-primary rounded">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span>Verified</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-warning-bg border border-warning-yellow rounded">
                          <div className="w-2 h-2 rounded-full bg-warning-yellow" />
                          <span>Pending</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-destructive/10 border border-destructive rounded">
                          <div className="w-2 h-2 rounded-full bg-destructive" />
                          <span>Deprecated</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {filteredResources.length > 0 ? (
                  <ResourceGrid
                    resources={filteredResources}
                    userRole={userRole}
                    onSelect={setSelectedResource}
                  />
                ) : (
                  <EmptyState searchTerm={searchTerm} />
                )}
              </div>
            </main>
          </>
        )}

        {currentView === 'vault' && (
          <main className="flex-1 overflow-y-auto">
            <ProcessVault />
          </main>
        )}

        {currentView === 'queue' && userRole === 'Manager' && (
          <main className="flex-1 overflow-y-auto">
            <ManagerApprovalQueue
              pendingResources={pendingResources}
              onVerify={handleVerify}
              onReject={handleReject}
            />
          </main>
        )}
      </div>

      <SubmissionWizard
        isOpen={isSubmissionOpen}
        onClose={() => setIsSubmissionOpen(false)}
        onSubmit={handleSubmission}
      />
    </div>
  );
}