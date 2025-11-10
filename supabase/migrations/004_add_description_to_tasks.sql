-- Add description column to tasks table
ALTER TABLE tasks ADD COLUMN description TEXT;

-- Update the existing tasks to have empty description for existing records
UPDATE tasks SET description = '' WHERE description IS NULL;

-- Make it not null with default empty string
ALTER TABLE tasks ALTER COLUMN description SET NOT NULL;
ALTER TABLE tasks ALTER COLUMN description SET DEFAULT '';