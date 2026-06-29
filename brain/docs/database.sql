create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  role text,
  level text,
  current_projects text[],
  goals text[],
  preferred_topics text[],
  disliked_topics text[],
  preferred_content_types text[],
  output_goals text[],
  custom_description text,
  created_at timestamp with time zone default now()
);

create table if not exists raw_items (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  source_url text not null,
  title text not null,
  raw_summary text,
  raw_content text,
  author text,
  published_at timestamp with time zone,
  aihot_rank int,
  raw_tags text[],
  created_at timestamp with time zone default now()
);

create table if not exists item_scores (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references raw_items(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  relevance_score int,
  role_fit int,
  goal_fit int,
  project_fit int,
  knowledge_level_fit int,
  actionability int,
  reusability int,
  novelty int,
  durability int,
  noise_penalty int,
  recommendation_reason text,
  value_tags text[],
  action_suggestion text,
  reading_cost text,
  created_at timestamp with time zone default now()
);

create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references raw_items(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  decision text not null check (decision in ('remembered', 'skipped', 'later')),
  feedback_note text,
  created_at timestamp with time zone default now(),
  unique(item_id, profile_id)
);

create table if not exists memory_intents (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references raw_items(id) on delete cascade,
  decision_id uuid references decisions(id) on delete cascade,
  memory_id uuid,
  emotion_tags text[],
  value_tags text[],
  use_case_tags text[],
  user_note text,
  ai_guess_reason text,
  created_at timestamp with time zone default now()
);

create table if not exists memory_cards (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references raw_items(id) on delete cascade,
  intent_id uuid references memory_intents(id) on delete set null,
  title text,
  one_sentence_value text,
  why_i_saved_it text,
  core_insights text[],
  memory_type text,
  emotion_tags text[],
  value_tags text[],
  use_case_tags text[],
  reusable_scenarios text[],
  related_projects text[],
  related_topics text[],
  confidence int,
  markdown_content text,
  created_at timestamp with time zone default now()
);

do $$
begin
  alter table memory_intents
    add constraint memory_intents_memory_id_fkey
    foreign key (memory_id)
    references memory_cards(id)
    on delete set null;
exception
  when duplicate_object then null;
end $$;

create table if not exists memory_manuals (
  id uuid primary key default gen_random_uuid(),
  memory_id uuid references memory_cards(id) on delete cascade,
  when_to_use text[],
  when_not_to_use text[],
  good_for_questions text[],
  not_good_for_questions text[],
  limitations text[],
  retrieval_keywords text[],
  priority int,
  created_at timestamp with time zone default now()
);

create table if not exists topic_pages (
  id uuid primary key default gen_random_uuid(),
  topic_name text unique not null,
  current_judgment text,
  key_points text[],
  supporting_memory_ids uuid[],
  open_questions text[],
  markdown_content text,
  last_updated_at timestamp with time zone default now()
);

create table if not exists outputs (
  id uuid primary key default gen_random_uuid(),
  output_type text,
  title text,
  content text,
  related_topic_ids uuid[],
  related_memory_ids uuid[],
  created_at timestamp with time zone default now()
);
