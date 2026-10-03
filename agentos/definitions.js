'use strict';

const common = (definition) => Object.freeze({
  status: 'available',
  version: '1.0.0',
  ...definition,
  capabilities: Object.freeze(definition.capabilities),
  allowedTools: Object.freeze(definition.allowedTools),
  restrictedActions: Object.freeze(definition.restrictedActions || []),
  approvalRequirements: Object.freeze(definition.approvalRequirements || []),
});

const AGENTS = Object.freeze([
  common({ id: 'gis-operations-agent', name: 'GIS Operations Agent', department: 'GIS', description: 'Validates and prepares spatial data without modifying authoritative sources.', capabilities: ['GIS data QA/QC', 'schema validation', 'coordinate system validation', 'GeoJSON inspection', 'duplicate detection', 'metadata generation', 'dataset inventory'], allowedTools: ['geojson-inspector', 'arcgis-service-reader'], restrictedActions: ['publish-authoritative-data', 'delete-gis-records', 'edit-production-feature-service', 'change-schema', 'overwrite-authoritative-dataset'], approvalRequirements: ['A named human supervisor must approve every authoritative-data or production-service change.'] }),
  common({ id: 'project-intelligence-agent', name: 'Project Intelligence Agent', department: 'Project Management', description: 'Structures requirements, milestones, risks, and project briefings.', capabilities: ['requirements decomposition', 'activity summarization', 'risk identification', 'milestone tracking', 'status report drafting'], allowedTools: ['project-record-reader', 'document-drafter'], restrictedActions: ['modify-project-baseline', 'notify-client'], approvalRequirements: ['Baseline changes and client communications require human approval.'] }),
  common({ id: 'opportunity-agent', name: 'Business Opportunity Agent', department: 'Business Development', description: 'Analyzes opportunities and prepares evidence-based pursuit materials.', capabilities: ['RFP analysis', 'requirement extraction', 'capability matching', 'opportunity summaries', 'proposal outline drafting'], allowedTools: ['document-reader', 'opportunity-analyzer'], restrictedActions: ['submit-proposal', 'commit-pricing', 'communicate-with-client', 'accept-contract'], approvalRequirements: ['Submission, pricing, contracts, and external communications require human approval.'] }),
  common({ id: 'analytics-agent', name: 'Data Intelligence Agent', department: 'Analytics', description: 'Prepares read-oriented analysis, queries, KPIs, and reporting datasets.', capabilities: ['SQL preparation', 'dataset analysis', 'anomaly detection', 'KPI calculation', 'analytical summarization'], allowedTools: ['read-only-sql-planner', 'dataset-profiler'], restrictedActions: ['modify-production-database', 'execute-destructive-sql', 'modify-schema'], approvalRequirements: ['Production or destructive database work requires human approval and a separately authorized execution tool.'] }),
  common({ id: 'growth-agent', name: 'Growth Intelligence Agent', department: 'Marketing', description: 'Prepares research and draft marketing material for human editorial review.', capabilities: ['market research', 'competitor analysis', 'content drafting', 'case study drafting', 'campaign analysis'], allowedTools: ['research-reader', 'document-drafter'], restrictedActions: ['publish-content', 'send-campaign', 'external-communication'], approvalRequirements: ['Publishing, campaigns, and external communications require human approval.'] }),
  common({ id: 'operations-agent', name: 'Business Operations Agent', department: 'Administration', description: 'Organizes internal knowledge and prepares administrative workflows.', capabilities: ['SOP preparation', 'internal documentation', 'onboarding preparation', 'knowledge organization', 'invoice preparation'], allowedTools: ['knowledge-reader', 'document-drafter'], restrictedActions: ['send-invoice', 'change-financial-record'], approvalRequirements: ['Financial record changes and invoice delivery require human approval.'] }),
  common({ id: 'executive-agent', name: 'Executive Intelligence Agent', department: 'Executive', description: 'Aggregates operational signals into advisory-only executive briefings.', capabilities: ['project health summaries', 'pipeline summaries', 'bottleneck identification', 'agent performance review', 'executive briefing preparation'], allowedTools: ['agentos-read-model'], restrictedActions: ['execute-recommendation', 'external-communication'], approvalRequirements: ['This agent is advisory-only and cannot execute recommendations.'] }),
]);

const getAgent = (id) => AGENTS.find((agent) => agent.id === id);

module.exports = { AGENTS, getAgent };
