import AddTaskForm from '../components/AddTaskForm';
import TaskList from '../components/TaskList';
import Navbar from '../components/Navbar';

import { TaskProvider } from '../contexts/TaskContext';

export default function TasksPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-black">
      <Navbar />
      <TaskProvider>
        <main className="container mx-auto p-4 pt-8">
          <div className="grid md:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
            {/* Left Section - Add Task */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Add New Task</h1>
                <div className="text-sm text-gray-300 bg-white/5 px-4 py-2 rounded-full inline-block">
                  Create and organize your tasks
                </div>
              </div>
              <AddTaskForm />
            </div>

            {/* Right Section - Task List */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">My Tasks</h2>
                <div className="text-sm text-gray-300 bg-white/5 px-4 py-2 rounded-full inline-block">
                  Manage your daily tasks
                </div>
              </div>
              <div className="h-[calc(100%-7rem)] overflow-y-auto">
                <TaskList />
              </div>
            </div>
          </div>
        </main>
      </TaskProvider>
    </div>
  );
}