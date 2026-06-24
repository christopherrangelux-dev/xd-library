import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Upload, MessageSquare } from 'lucide-react';
import { Discipline, ResourceType } from '../hooks/useResources';

interface SubmissionWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubmissionData) => void;
  initialData?: Partial<SubmissionData>;
  editingResourceId?: string;
  lastReviewComment?: string;
}

export interface SubmissionData {
  title: string;
  description: string;
  url: string;
  discipline: Discipline | '';
  resourceType: ResourceType | '';
  tags: string[];
  contributorName: string;
  contributorEmail: string;
}

const disciplines: Discipline[] = ['UX', 'Design', 'Research', 'Strategy', 'Content'];
const resourceTypes: ResourceType[] = ['Template', 'Guide', 'Tool', 'Asset'];

const suggestedTags = [
  'Wireframes',
  'Prototyping',
  'User Testing',
  'Analytics',
  'Design System',
  'Components',
  'Branding',
  'Visual Identity',
  'Strategy',
  'Planning',
  'Content',
  'Writing',
];

export function SubmissionWizard({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  editingResourceId,
  lastReviewComment,
}: SubmissionWizardProps) {
  const isEditing = Boolean(editingResourceId);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SubmissionData>({
    title: '',
    description: '',
    url: '',
    discipline: '',
    resourceType: '',
    tags: [],
    contributorName: '',
    contributorEmail: '',
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        title: '',
        description: '',
        url: '',
        discipline: '',
        resourceType: '',
        tags: [],
        contributorName: '',
        contributorEmail: '',
        ...initialData,
      });
      setStep(1);
    }
  }, [isOpen, initialData]);

  const updateField = (field: keyof SubmissionData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const canProceedStep1 =
    formData.title.trim() && formData.description.trim() && formData.url.trim();
  const canProceedStep2 = formData.discipline && formData.resourceType && formData.tags.length > 0;
  const canSubmit = formData.contributorName.trim() && formData.contributorEmail.trim();

  const handleSubmit = () => {
    if (canSubmit) {
      onSubmit(formData);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      url: '',
      discipline: '',
      resourceType: '',
      tags: [],
      contributorName: '',
      contributorEmail: '',
    });
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-foreground mb-1">
              {isEditing ? 'Edit & Resubmit Resource' : 'Submit a Resource'}
            </h2>
            <p className="text-[14px] text-muted-foreground">
              Step {step} of 3: {step === 1 ? 'Asset Details' : step === 2 ? 'Taxonomy Tagging' : 'Contributor Info'}
            </p>
          </div>
          <button
            onClick={resetForm}
            className="w-8 h-8 rounded-lg hover:bg-secondary transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6">
              {isEditing && lastReviewComment && (
                <div className="p-4 bg-accent border border-primary/20 rounded-lg">
                  <p className="text-[14px] text-foreground flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Manager feedback:</strong> {lastReviewComment}
                    </span>
                  </p>
                </div>
              )}
              <div>
                <label className="block text-foreground mb-2">
                  Resource Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g., UX Research Interview Template"
                  className="w-full h-11 px-4 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-foreground mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Provide a clear description of this resource..."
                  className="w-full h-24 px-4 py-3 bg-input-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-foreground mb-2">
                  Resource URL *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => updateField('url', e.target.value)}
                  placeholder="https://..."
                  className="w-full h-11 px-4 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              <div className="p-4 bg-accent border border-primary/20 rounded-lg">
                <p className="text-[14px] text-foreground">
                  <strong>Tip:</strong> Make sure your resource URL is accessible to all team members and points to the latest version.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-foreground mb-3">
                  Discipline * <span className="text-muted-foreground text-[14px]">(Select one)</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {disciplines.map((discipline) => (
                    <button
                      key={discipline}
                      onClick={() => updateField('discipline', discipline)}
                      className={`h-11 rounded-lg border transition-all ${
                        formData.discipline === discipline
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card border-border hover:border-primary hover:bg-secondary'
                      }`}
                    >
                      {discipline}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-foreground mb-3">
                  Resource Type * <span className="text-muted-foreground text-[14px]">(Select one)</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {resourceTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => updateField('resourceType', type)}
                      className={`h-11 rounded-lg border transition-all ${
                        formData.resourceType === type
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card border-border hover:border-primary hover:bg-secondary'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-foreground mb-3">
                  Tags * <span className="text-muted-foreground text-[14px]">(Select at least one)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 h-8 rounded-lg border text-[14px] transition-all ${
                        formData.tags.includes(tag)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card border-border hover:border-primary hover:bg-secondary'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-accent border border-primary/20 rounded-lg">
                <p className="text-[14px] text-foreground">
                  <strong>Taxonomy compliance:</strong> These selections ensure your resource is properly categorized and discoverable by the team.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="p-6 bg-accent border border-primary/20 rounded-lg">
                <h3 className="text-foreground mb-2">
                  {isEditing ? 'Review Your Resubmission' : 'Review Your Submission'}
                </h3>
                <div className="space-y-2 text-[14px]">
                  <p>
                    <strong>Title:</strong> {formData.title}
                  </p>
                  <p>
                    <strong>Discipline:</strong> {formData.discipline}
                  </p>
                  <p>
                    <strong>Type:</strong> {formData.resourceType}
                  </p>
                  <p>
                    <strong>Tags:</strong> {formData.tags.join(', ')}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-foreground mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={formData.contributorName}
                  onChange={(e) => updateField('contributorName', e.target.value)}
                  placeholder="John Doe"
                  className="w-full h-11 px-4 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-foreground mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  value={formData.contributorEmail}
                  onChange={(e) => updateField('contributorEmail', e.target.value)}
                  placeholder="john.doe@company.com"
                  className="w-full h-11 px-4 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-[14px] text-muted-foreground">
                  By submitting this resource, you confirm that it meets quality standards and is appropriate for the XD Library. You'll be notified once it's reviewed.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border flex items-center justify-between">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : resetForm())}
            className="h-11 px-6 rounded-lg border border-border hover:bg-secondary transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {step > 1 ? 'Back' : 'Cancel'}
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={(step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2)}
              className="h-11 px-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="h-11 px-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {isEditing ? 'Resubmit for Review' : 'Submit for Review'}
            </button>
          )}
        </div>

        <div className="px-6 pb-4">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
