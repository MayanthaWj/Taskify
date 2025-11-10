-- Add updated_at column to tasks table
alter table tasks add column updated_at timestamp with time zone default now();

-- Create a function to automatically update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create a trigger to automatically update updated_at on row update
create trigger update_tasks_updated_at
    before update on tasks
    for each row
    execute function update_updated_at_column();