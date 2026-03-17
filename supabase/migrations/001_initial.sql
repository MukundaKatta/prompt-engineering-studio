-- Prompt Engineering Studio — Initial Schema
-- Run with: supabase db push

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Prompts table
create table if not exists prompts (
  id uuid primary key default uuid_generate_v4(),
  title text not null default 'Untitled Prompt',
  content text not null default '',
  system_prompt text not null default '',
  variables jsonb not null default '[]'::jsonb,
  model_id text not null default 'claude-sonnet-4-20250514',
  temperature float not null default 0.7,
  max_tokens integer not null default 2048,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Prompt versions for history tracking
create table if not exists prompt_versions (
  id uuid primary key default uuid_generate_v4(),
  prompt_id uuid not null references prompts(id) on delete cascade,
  version integer not null,
  content text not null,
  system_prompt text not null default '',
  variables jsonb not null default '[]'::jsonb,
  diff text,
  message text,
  created_at timestamptz not null default now(),
  unique(prompt_id, version)
);

-- Runs — each execution of a prompt
create table if not exists runs (
  id uuid primary key default uuid_generate_v4(),
  prompt_id uuid references prompts(id) on delete set null,
  model_id text not null,
  input text not null,
  system_prompt text not null default '',
  output text not null,
  variables jsonb not null default '[]'::jsonb,
  temperature float not null default 0.7,
  max_tokens integer not null default 2048,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  latency_ms integer not null default 0,
  cost decimal(12, 8) not null default 0,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Evaluations — quality scores per run
create table if not exists evaluations (
  id uuid primary key default uuid_generate_v4(),
  run_id uuid not null references runs(id) on delete cascade,
  relevance integer not null default 0,
  coherence integer not null default 0,
  accuracy integer not null default 0,
  creativity integer not null default 0,
  overall integer not null default 0,
  feedback text,
  created_at timestamptz not null default now()
);

-- Templates — marketplace of reusable prompts
create table if not exists templates (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null default '',
  category text not null default 'General',
  content text not null,
  system_prompt text not null default '',
  variables jsonb not null default '[]'::jsonb,
  author text not null default 'Anonymous',
  usage_count integer not null default 0,
  rating decimal(3, 2) not null default 0,
  tags text[] not null default '{}',
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_prompts_user_id on prompts(user_id);
create index if not exists idx_prompts_updated_at on prompts(updated_at desc);
create index if not exists idx_prompt_versions_prompt_id on prompt_versions(prompt_id);
create index if not exists idx_runs_prompt_id on runs(prompt_id);
create index if not exists idx_runs_created_at on runs(created_at desc);
create index if not exists idx_evaluations_run_id on evaluations(run_id);
create index if not exists idx_templates_category on templates(category);
create index if not exists idx_templates_usage_count on templates(usage_count desc);

-- Row Level Security
alter table prompts enable row level security;
alter table prompt_versions enable row level security;
alter table runs enable row level security;
alter table evaluations enable row level security;
alter table templates enable row level security;

-- Policies: users can only access their own data
create policy "Users can view own prompts" on prompts
  for select using (auth.uid() = user_id);

create policy "Users can insert own prompts" on prompts
  for insert with check (auth.uid() = user_id);

create policy "Users can update own prompts" on prompts
  for update using (auth.uid() = user_id);

create policy "Users can delete own prompts" on prompts
  for delete using (auth.uid() = user_id);

-- Runs: users see their own
create policy "Users can view own runs" on runs
  for select using (auth.uid() = user_id);

create policy "Users can insert own runs" on runs
  for insert with check (auth.uid() = user_id);

-- Templates: publicly readable
create policy "Templates are publicly readable" on templates
  for select using (true);

create policy "Users can insert templates" on templates
  for insert with check (auth.uid() = user_id);

-- Versions follow prompt ownership
create policy "Users can view versions of own prompts" on prompt_versions
  for select using (
    exists (select 1 from prompts where prompts.id = prompt_versions.prompt_id and prompts.user_id = auth.uid())
  );

create policy "Users can insert versions of own prompts" on prompt_versions
  for insert with check (
    exists (select 1 from prompts where prompts.id = prompt_versions.prompt_id and prompts.user_id = auth.uid())
  );

-- Evaluations follow run ownership
create policy "Users can view evaluations of own runs" on evaluations
  for select using (
    exists (select 1 from runs where runs.id = evaluations.run_id and runs.user_id = auth.uid())
  );

create policy "Users can insert evaluations of own runs" on evaluations
  for insert with check (
    exists (select 1 from runs where runs.id = evaluations.run_id and runs.user_id = auth.uid())
  );

-- Auto-update updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger prompts_updated_at
  before update on prompts
  for each row execute function update_updated_at();

create trigger templates_updated_at
  before update on templates
  for each row execute function update_updated_at();
