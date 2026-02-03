"use client";

import { useEffect, useState } from "react";
import {
  DashboardFrame,
  GovernanceChecklist,
  MapTileCard,
  PipelineSchematic,
} from "./VisualProofs";
import { useReveal } from "../hooks/useReveal";

const studies = [
  {
    id: "metro",
    title: "Metro Mobility Analytics",
    badge: "24% faster corridor planning",
    summary:
      "Integrated multimodal ridership, safety, and equity signals into a single executive view.",
    outcome: "Capital planning cycles shortened from 90 to 68 days.",
    scope: "6 rail corridors, 22 bus routes, 3 legacy GIS stores.",
    approach:
      "Unified GTFS feeds, incident logs, and asset condition data into a governed analytics layer.",
    riskControls:
      "CJIS-aligned access tiers, audit logging, and data minimization by zone.",
    timeToValue: "First executive dashboard delivered in 7 weeks.",
    Visual: MapTileCard,
  },
  {
    id: "utility",
    title: "Utility Network Modernization",
    badge: "31% outage response lift",
    summary:
      "Modernized asset records and field mobility for a regulated utility.",
    outcome: "Outage restoration workflows reduced by 18%.",
    scope: "Transmission + distribution, 420k assets, 14 field teams.",
    approach:
      "Phased migration to a governed network model with automated QA gates.",
    riskControls:
      "FISMA moderate controls mapped to GIS workflows and vendor review.",
    timeToValue: "Staged rollout completed in 12 weeks.",
    Visual: PipelineSchematic,
  },
  {
    id: "emergency",
    title: "Emergency Response Dashboards",
    badge: "38% faster situational updates",
    summary:
      "Delivered executive-ready incident views during multi-agency activations.",
    outcome: "Real-time operational briefs delivered hourly with 99% uptime.",
    scope: "Statewide incident management, 6 agencies, 4 dispatch systems.",
    approach:
      "Built resilient dashboards with embedded contingency workflows and training.",
    riskControls:
      "Zero-trust authentication and continuous monitoring across data sources.",
    timeToValue: "First operational dashboard live in 3 weeks.",
    Visual: DashboardFrame,
  },
];

export default function CaseStudies() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = studies.find((study) => study.id === activeId);
  const { ref, visible } = useReveal();

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveId(null);
      }
    };

    if (activeId) {
      window.addEventListener("keydown", handleKey);
    }

    return () => window.removeEventListener("keydown", handleKey);
  }, [activeId]);

  return (
    <div ref={ref} className={`reveal ${visible ? "is-visible" : ""}`}>
      <div className="case-grid">
        {studies.map((study) => (
          <article key={study.id} className="card case-card">
            <span className="badge">{study.badge}</span>
            <h3>{study.title}</h3>
            <p>{study.summary}</p>
            <div className="visual-proof">
              <study.Visual />
            </div>
            <div className="actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setActiveId(study.id)}
              >
                Quick view
              </button>
              <span className="helper-text">Anonymized engagement.</span>
            </div>
          </article>
        ))}
      </div>
      {active ? (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} quick view`}
          onClick={() => setActiveId(null)}
        >
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <span className="badge">{active.badge}</span>
                <h3>{active.title}</h3>
                <p className="helper-text">
                  Project details are anonymized to protect client privacy and
                  security.
                </p>
              </div>
              <button
                type="button"
                className="button button-ghost"
                onClick={() => setActiveId(null)}
              >
                Close
              </button>
            </header>
            <section>
              <strong>Outcome</strong>
              <p>{active.outcome}</p>
            </section>
            <section>
              <strong>Scope</strong>
              <p>{active.scope}</p>
            </section>
            <section>
              <strong>Approach</strong>
              <p>{active.approach}</p>
            </section>
            <section>
              <strong>Risk controls</strong>
              <p>{active.riskControls}</p>
            </section>
            <section>
              <strong>Time-to-value</strong>
              <p>{active.timeToValue}</p>
            </section>
            <div className="helper-text">
              Representative outcomes; shareable metrics are approved by client
              governance teams.
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
