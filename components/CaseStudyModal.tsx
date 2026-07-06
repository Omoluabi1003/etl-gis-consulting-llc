"use client";

interface CaseStudy {
  id: string;
  title: string;
  outcome: string;
  scope: string;
  approach: string;
  riskControls: string;
  timeToValue: string;
}

interface CaseStudyModalProps {
  study: CaseStudy | null;
  onClose: () => void;
}

export default function CaseStudyModal({ study, onClose }: CaseStudyModalProps) {
  if (!study) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <h3>{study.title}</h3>
          <button className="button secondary" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="form-grid">
          <div>
            <strong>Outcome</strong>
            <p className="helper">{study.outcome}</p>
          </div>
          <div>
            <strong>Scope</strong>
            <p className="helper">{study.scope}</p>
          </div>
          <div>
            <strong>Approach</strong>
            <p className="helper">{study.approach}</p>
          </div>
          <div>
            <strong>Risk controls</strong>
            <p className="helper">{study.riskControls}</p>
          </div>
          <div>
            <strong>Time-to-value</strong>
            <p className="helper">{study.timeToValue}</p>
          </div>
        </div>
        <p className="disclaimer">
          All project names and quantitative details are anonymized for client
          confidentiality. Metrics represent typical ranges shared with client
          leadership teams.
        </p>
      </div>
    </div>
  );
}
