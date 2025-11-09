"use client";

import { useState } from 'react';
import AddTaskForm from '../components/AddTaskForm';
import KanbanBoard from '../components/KanbanBoard';
import Navbar from '../components/Navbar';

import { TaskProvider } from '../contexts/TaskContext';

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-black">
      <Navbar />
      <TaskProvider>
        <main className="container mx-auto p-4 pt-6 relative z-0">         
          {/* Main content: Kanban board */}
          <div className="relative z-10 h-[calc(100vh-6rem)] overflow-y-auto">
            <KanbanBoard />
          </div>

          {/* Modal for AddTaskForm */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
              <div className="relative bg-white/6 backdrop-blur-md rounded-2xl border border-white/6 p-6 w-full max-w-2xl m-4">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Add Task</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-primary-200 hover:text-white"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
                <AddTaskForm onDone={() => setIsModalOpen(false)} />
              </div>
            </div>
          )}
        </main>
      </TaskProvider>
    </div>
  );
}