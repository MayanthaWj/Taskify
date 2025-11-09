# Taskify - Task Management Application

A modern, intuitive task management application built with Next.js 16, Supabase, and TypeScript. Taskify helps you organize your work with a beautiful Kanban board interface, priority management, and real-time updates.

## 🚀 Live Demo

[View Live Application](https://taskify-seven-ashen.vercel.app)

## ✨ Features

- **User Authentication**
  - Email/password authentication via Supabase Auth
  - Secure user sessions
  - Email verification on signup
  - Protected routes

- **Task Management**
  - Create, read, update, and delete tasks
  - Drag-and-drop Kanban board with 4 columns (Todo, In Progress, On Hold, Completed)
  - Task prioritization (Urgent, High, Low)
  - Due date tracking with validation
  - Task status management
  - Real-time updates across sessions

- **User Experience**
  - Responsive design for mobile, tablet, and desktop
  - Dark mode UI with glassmorphism effects
  - Smooth animations and transitions
  - Confirmation dialogs for destructive actions
  - Form validation with helpful error messages
  - Loading states and user feedback

- **Security**
  - Row Level Security (RLS) policies in Supabase
  - Users can only access their own tasks
  - Secure API routes
  - Protected client-side routes

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database & Auth:** Supabase
- **Styling:** Tailwind CSS
- **UI Components:** Headless UI
- **Form Handling:** React Hook Form
- **Drag & Drop:** @hello-pangea/dnd
- **Deployment:** Vercel

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm or yarn
- A Supabase account (free tier available)
- A Vercel account (free tier available)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd taskify
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the following schema:

```sql
-- Create tasks table
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  priority text check (priority in ('urgent', 'high', 'low')) default 'low',
  status text check (status in ('todo', 'inprogress', 'onhold', 'completed')) default 'todo',
  due_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.tasks enable row level security;

-- Create policies
create policy "Users can view their own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.tasks
  for each row
  execute function public.handle_updated_at();
```

3. Get your API credentials from **Project Settings > API**

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add the environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

Vercel will automatically detect the Next.js project and configure the build settings.

## 📱 Usage

### Getting Started

1. **Sign Up**: Create a new account on the login page
2. **Verify Email**: Check your email and verify your account
3. **Sign In**: Log in with your credentials
4. **Create Tasks**: Click "Add Task" to create your first task
5. **Manage Tasks**: Drag and drop tasks between columns or use the status dropdown
6. **Complete Tasks**: Move tasks to the "Completed" column when done

### Task Management

- **Create Task**: Click the "Add Task" button and fill in the details
- **Edit Status**: Use the dropdown on each task card or drag to a different column
- **Delete Task**: Click the delete icon and confirm the action
- **Set Priority**: Choose from Urgent, High, or Low priority levels
- **Set Due Date**: Add a future date/time for task completion

## 🎨 Key Features Explanation

### Authentication Flow
- Users sign up with email/password
- Email verification is required before first login
- Sessions are managed securely with Supabase Auth
- Protected routes redirect unauthenticated users to login

### Kanban Board
- Four status columns: Todo, In Progress, On Hold, Completed
- Drag-and-drop functionality for intuitive task management
- Real-time task count in each column
- Visual feedback during drag operations

### Form Validation
- React Hook Form for efficient form handling
- Real-time validation feedback
- Password confirmation matching
- Future date validation for due dates

### Security
- Row Level Security (RLS) ensures data isolation
- Each user can only access their own tasks
- Secure authentication flow
- Protected API endpoints

## 🔒 Security Considerations

- All tasks are protected by Supabase RLS policies
- User authentication is required for all task operations
- Client-side route protection redirects unauthorized users
- Environment variables keep sensitive data secure

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- Tailwind CSS for the styling utilities
- The open-source community

---
