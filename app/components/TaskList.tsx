'use client';

import { useState } from 'react';
import ConfirmationDialog from './ConfirmationDialog';
import { useTaskContext } from '../contexts/TaskContext';

export default function TaskList() {
  const { tasks, deleteTask, toggleTaskComplete } = useTaskContext();
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  return (
    <>
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl text-gray-300">
            No tasks found. Add your first task on the left!
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg transition-all hover:bg-white/20"
            >
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskComplete(task.id, task.completed)}
                  className="h-5 w-5 rounded-md border-gray-600 bg-white/5 text-emerald-500 focus:ring-emerald-500/50 transition-colors"
                />
                <span className={`text-base truncate ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                  {task.title}
                </span>
              </div>
              <button
                onClick={() => setTaskToDelete(task.id)}
                className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors group"
                aria-label="Delete task"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                  />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      <ConfirmationDialog
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) {
            deleteTask(taskToDelete);
          }
        }}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </>
  );
}