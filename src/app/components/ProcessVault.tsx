import { useState } from 'react';
import { FileText, BookOpen, Maximize2, Minimize2 } from 'lucide-react';

interface TaxonomyNode {
  name: string;
  children?: TaxonomyNode[];
  count?: number;
  color?: string;
}

const taxonomyData: TaxonomyNode[] = [
  {
    name: 'UX',
    color: '#3b82f6',
    children: [
      { name: 'Wireframes', count: 12 },
      { name: 'User Flows', count: 8 },
      { name: 'Prototypes', count: 15 },
      { name: 'Accessibility', count: 6 },
    ],
  },
  {
    name: 'Design',
    color: '#8b5cf6',
    children: [
      { name: 'Design Systems', count: 10 },
      { name: 'UI Patterns', count: 18 },
      { name: 'Visual Assets', count: 24 },
      { name: 'Branding', count: 9 },
    ],
  },
  {
    name: 'Research',
    color: '#10b981',
    children: [
      { name: 'Interview Scripts', count: 14 },
      { name: 'Analytics', count: 11 },
      { name: 'User Testing', count: 13 },
      { name: 'Surveys', count: 7 },
    ],
  },
  {
    name: 'Strategy',
    color: '#f59e0b',
    children: [
      { name: 'Frameworks', count: 9 },
      { name: 'Roadmaps', count: 6 },
      { name: 'Journey Maps', count: 8 },
      { name: 'Planning', count: 12 },
    ],
  },
  {
    name: 'Content',
    color: '#ec4899',
    children: [
      { name: 'Guidelines', count: 10 },
      { name: 'Templates', count: 16 },
      { name: 'Copy Decks', count: 8 },
      { name: 'IA Resources', count: 5 },
    ],
  },
];

export function ProcessVault() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8 p-4 sm:p-8">
      <div className="flex-1 bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-foreground mb-1">Taxonomy Explorer</h2>
            <p className="text-[14px] text-muted-foreground">
              Interactive visualization of the XD Library information architecture
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-9 px-3 rounded-lg border border-border hover:bg-secondary transition-colors"
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {taxonomyData.map((discipline) => (
            <div
              key={discipline.name}
              className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
              onClick={() =>
                setSelectedNode(
                  selectedNode === discipline.name ? null : discipline.name
                )
              }
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: discipline.color }}
                />
                <h3 className="text-foreground">{discipline.name}</h3>
              </div>

              {selectedNode === discipline.name && discipline.children && (
                <div className="space-y-2 mt-3 pt-3 border-t border-border">
                  {discipline.children.map((child) => (
                    <div
                      key={child.name}
                      className="flex items-center justify-between p-2 rounded hover:bg-secondary transition-colors"
                    >
                      <span className="text-[14px] text-foreground">
                        {child.name}
                      </span>
                      <span className="text-[12px] text-muted-foreground bg-muted px-2 py-1 rounded">
                        {child.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {selectedNode !== discipline.name && discipline.children && (
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <span>
                    {discipline.children.length} subcategories •{' '}
                    {discipline.children.reduce(
                      (sum, child) => sum + (child.count || 0),
                      0
                    )}{' '}
                    resources
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-accent border border-primary/20 rounded-lg">
          <p className="text-[14px] text-foreground">
            <strong>About the Taxonomy:</strong> This structure represents the
            cohesive Experience Design Taxonomy that governs resource
            categorization across the XD Library. Click each discipline to
            explore its subcategories.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-[400px] space-y-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-foreground">Service Map</h3>
              <p className="text-[12px] text-muted-foreground">
                Visual guide to XD services
              </p>
            </div>
          </div>
          <p className="text-[14px] text-muted-foreground mb-4">
            Comprehensive map of design services, capabilities, and delivery
            workflows across the organization.
          </p>
          <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            View Service Map
          </button>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <FileText className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="text-foreground">Governance Playbook</h3>
              <p className="text-[12px] text-muted-foreground">
                Rules & procedures
              </p>
            </div>
          </div>
          <p className="text-[14px] text-muted-foreground mb-4">
            Internal documentation covering resource submission, approval
            workflows, and quality standards.
          </p>
          <button className="w-full h-10 rounded-lg border border-border hover:bg-secondary transition-colors">
            View Playbook
          </button>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h4 className="text-foreground mb-3">Key Metrics</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-muted-foreground">
                Total Resources
              </span>
              <span className="text-foreground">247</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-muted-foreground">
                Active Contributors
              </span>
              <span className="text-foreground">42</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-muted-foreground">
                Pending Review
              </span>
              <span className="text-warning-yellow">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-muted-foreground">
                Last Updated
              </span>
              <span className="text-foreground">Apr 19, 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
