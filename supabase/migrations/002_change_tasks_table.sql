-- 1. Create enums
create type priority_enum as enum ('urgent', 'high', 'low');
create type status_enum as enum ('todo', 'inprogress', 'onhold', 'completed');

-- 2. Add new columns
alter table tasks add column priority priority_enum not null default 'low';
alter table tasks add column due_date timestamp with time zone;

-- 3. Add status column and migrate data if needed
alter table tasks add column status status_enum not null default 'todo';

-- 4. Remove the old completed column
alter table tasks drop column completed;