"use client";

import { Draggable } from '@hello-pangea/dnd';
import { useTaskContext } from '../contexts/TaskContext';
import { useState } from 'react';
import ConfirmationDialog from './ConfirmationDialog';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    priority?: 'urgent' | 'high' | 'low';
    status?: 'todo' | 'inprogress' | 'onhold' | 'completed';
    due_date?: string | null;
  };
  index: number; 
}

export default function TaskCard({ task, index }: TaskCardProps) {
  const { deleteTask, updateTaskStatus } = useTaskContext();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const priorityColors: Record<string, string> = {
    urgent: 'bg-red-500',
    high: 'bg-yellow-400',
    low: 'bg-green-400',
  };

  const onStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as TaskCardProps['task']['status'];
    await updateTaskStatus(task.id, newStatus);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    deleteTask(task.id);
  };

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`bg-white/6 p-4 rounded-lg shadow-sm border border-white/6 
              ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary-500/50' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  {/* Drag handle */}
                  <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5v4m0 6v4M15 5v4m0 6v4"
                      />
                    </svg>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${priorityColors[task.priority ?? 'low'] || 'bg-gray-400'}`} />
                  <h3 className="font-semibold text-white truncate">{task.title}</h3>
                </div>
                <div className="mt-2 text-sm text-white/80 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-white/5 capitalize text-white/90">{task.priority ?? 'low'}</span>
                  {task.due_date && (
                    <span className="ml-2">Due: {new Date(task.due_date).toLocaleString()}</span>
                  )}
                </div>
              </div>

              <div className="ml-3 flex flex-col items-end">
                <select
                  value={task.status ?? 'todo'}
                  onChange={onStatusChange}
                  className="bg-white/5 text-sm rounded-md p-1 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  style={{
                    colorScheme: 'dark'
                  }}
                  aria-label="Change status"
                >
                  <option value="todo" className="bg-gray-800 text-white">Todo</option>
                  <option value="inprogress" className="bg-gray-800 text-white">In Progress</option>
                  <option value="onhold" className="bg-gray-800 text-white">On Hold</option>
                  <option value="completed" className="bg-gray-800 text-white">Completed</option>
                </select>

                <button
                  onClick={handleDeleteClick}
                  className="mt-2 text-red-400 hover:text-red-300 p-1 rounded transition-colors hover:bg-white/5"
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
            </div>
          </div>
        )}
      </Draggable>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
      />
    </>
  );
}