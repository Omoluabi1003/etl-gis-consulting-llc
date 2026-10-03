-- ETL GIS AgentOS persistence schema for Supabase/PostgreSQL.
-- Tables are server-only: do not grant browser roles direct access.
create table if not exists public.agentos_tasks (
  id text primary key, title text not null check (char_length(title) between 1 and 160),
  description text not null check (char_length(description) between 1 and 4000),
  initiated_by text not null, agent_id text not null, requested_action text not null default '',
  input jsonb, status text not null check (status in ('REQUESTED','ANALYZING','ASSIGNED','RUNNING','REVIEW_REQUIRED','APPROVED','COMPLETED','FAILED')),
  created_at timestamptz not null, updated_at timestamptz not null, actions jsonb not null default '[]',
  outputs jsonb not null default '[]', approval_required boolean not null default false, error text
);
create table if not exists public.agentos_approvals (
  id text primary key, task_id text not null references public.agentos_tasks(id), agent_id text not null,
  action text not null, rationale text not null, requested_by text not null,
  status text not null check (status in ('PENDING','APPROVED','REJECTED','REVISION_REQUESTED')),
  created_at timestamptz not null, decided_at timestamptz, decided_by text, decision_note text
);
create table if not exists public.agentos_audit_events (
  id text primary key, timestamp timestamptz not null, user_name text not null, agent_id text not null,
  task_id text not null, tool text not null, action text not null, result text not null,
  approval_status text not null, error text
);
create index if not exists agentos_tasks_created_at_idx on public.agentos_tasks (created_at desc);
create index if not exists agentos_tasks_agent_status_idx on public.agentos_tasks (agent_id, status);
create index if not exists agentos_approvals_status_idx on public.agentos_approvals (status, created_at desc);
create index if not exists agentos_audit_task_idx on public.agentos_audit_events (task_id, timestamp desc);
alter table public.agentos_tasks enable row level security;
alter table public.agentos_approvals enable row level security;
alter table public.agentos_audit_events enable row level security;
