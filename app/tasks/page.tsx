import AddTaskForm from '../components/AddTaskForm';
import TaskList from '../components/TaskList';
import Navbar from '../components/Navbar';

export default function TasksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4 pt-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
            <div className="text-sm text-gray-500">
              Manage your daily tasks
            </div>
          </div>
          <AddTaskForm />
        </div>
        <TaskList />
      </main>
    </div>
  );
}