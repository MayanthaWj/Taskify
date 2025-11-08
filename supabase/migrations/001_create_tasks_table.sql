create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default now()
);

alter table tasks enable row level security;

create policy "Users can manage their own tasks"
on tasks for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
