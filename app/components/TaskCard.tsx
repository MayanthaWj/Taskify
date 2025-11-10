"use client";

import { Draggable } from '@hello-pangea/dnd';
import { useTaskContext } from '../contexts/TaskContext';
import { useState, useRef, useEffect, JSX } from 'react';
import ConfirmationDialog from './ConfirmationDialog';
import AddTaskForm from './AddTaskForm';

// Custom hook for countdown
const useCountdown = (targetDate: string | null) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isOverdue: boolean;
  } | null>(null);

  useEffect(() => {
    if (!targetDate) {
      // Use setTimeout to make this asynchronous
      const timeoutId = setTimeout(() => {
        setTimeLeft(null);
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isOverdue: true
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isOverdue: false
      };
    };

    // Initial update on next tick
    const timeoutId = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 0);

    // Update every second
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [targetDate]);

  return timeLeft;
};

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    priority?: 'urgent' | 'high' | 'low';
    status?: 'todo' | 'inprogress' | 'onhold' | 'completed';
    due_date?: string | null;
  };
  index: number; 
}

export default function TaskCard({ task, index }: TaskCardProps) {
  const { deleteTask } = useTaskContext();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Use the countdown hook
  const timeLeft = useCountdown(task.due_date || null);

  const priorityConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
    urgent: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/50', label: 'Urgent' },
    high: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/50', label: 'High' },
    low: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/50', label: 'Low' },
  };

  const statusConfig: Record<string, { icon: JSX.Element; color: string }> = {
    todo: {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'text-blue-400'
    },
    inprogress: {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-yellow-400'
    },
    onhold: {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-orange-400'
    },
    completed: {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-green-400'
    }
  };

  const currentPriority = priorityConfig[task.priority ?? 'low'];
  const currentStatus = statusConfig[task.status ?? 'todo'];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
    setIsMenuOpen(false);
  };

  const handleEditClick = () => {
    setShowEditModal(true);
    setIsMenuOpen(false);
  };

  const handleViewClick = () => {
    setShowViewModal(true);
    setIsMenuOpen(false);
  };

  const handleConfirmDelete = () => {
    deleteTask(task.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityLabel = (priority: string) => {
    return priorityConfig[priority]?.label || 'Low';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      todo: 'To Do',
      inprogress: 'In Progress',
      onhold: 'On Hold',
      completed: 'Completed'
    };
    return labels[status] || 'To Do';
  };

  // Format the countdown display
  const formatTimeLeft = (timeLeft: { days: number; hours: number; minutes: number; seconds: number; isOverdue: boolean } | null) => {
    if (!timeLeft) return null;
    
    if (timeLeft.isOverdue) {
      return 'Overdue';
    }
    
    if (timeLeft.days > 0) {
      return `${timeLeft.days}d ${timeLeft.hours}h left`;
    } else if (timeLeft.hours > 0) {
      return `${timeLeft.hours}h ${timeLeft.minutes}m left`;
    } else if (timeLeft.minutes > 0) {
      return `${timeLeft.minutes}m ${timeLeft.seconds}s left`;
    } else {
      return `${timeLeft.seconds}s left`;
    }
  };

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`bg-linear-to-br from-white/8 to-white/4 backdrop-blur-sm p-4 rounded-xl shadow-lg border-2 
              ${snapshot.isDragging ? 'border-white/30 shadow-2xl scale-105' : 'border-white/10'} 
              transition-all duration-200 hover:border-white/20 min-h-40 flex flex-col`}
          >
            {/* Header with status icon and menu */}
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg bg-white/5 ${currentStatus.color}`}>
                {currentStatus.icon}
              </div>
              
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`p-1.5 rounded-lg transition-all ${
                    isMenuOpen 
                      ? 'bg-white/20 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  aria-label="Task options"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-40 py-1 bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 z-100">
                    <button
                      onClick={handleViewClick}
                      className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button
                      onClick={handleEditClick}
                      className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <div className="border-t border-white/10 my-1"></div>
                    <button
                      onClick={handleDeleteClick}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Task content */}
            <div className="flex-1 flex flex-col">
              {/* Drag handle and title */}
              <div className="flex items-center gap-2 mb-2" {...provided.dragHandleProps}>
                <svg className="w-4 h-4 text-gray-500 cursor-grab active:cursor-grabbing shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
                <h3 className="font-semibold text-white text-base leading-snug">{task.title}</h3>
              </div>

              {/* Description */}
              {task.description && (
                <p className="text-sm text-white/60 line-clamp-2 mb-3 leading-relaxed">
                  {task.description}
                </p>
              )}

              {/* Footer with priority and due date */}
              <div className="mt-auto flex items-center justify-between pt-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${currentPriority.bg} ${currentPriority.text} ${currentPriority.border}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {currentPriority.label}
                </span>
                
                {task.due_date && timeLeft && (
                  <span className={`text-xs flex items-center gap-1 ${
                    timeLeft.isOverdue 
                      ? 'text-red-400' 
                      : timeLeft.days === 0 && timeLeft.hours < 24 
                        ? 'text-yellow-400' 
                        : 'text-white/50'
                  }`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatTimeLeft(timeLeft)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </Draggable>

      {/* View Modal */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowViewModal(false)} />
          <div className="relative bg-linear-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 p-6 w-full max-w-lg m-4 shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Task Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                <p className="text-white text-lg font-medium">{task.title}</p>
              </div>
              {task.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <p className="text-white/90 whitespace-pre-wrap leading-relaxed bg-white/5 p-4 rounded-lg border border-white/10 max-h-60 overflow-y-auto wrap-break-word">{task.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Priority</label>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${currentPriority.bg} ${currentPriority.text} ${currentPriority.border}`}>
                    <span className="w-2 h-2 rounded-full bg-current"></span>
                    {getPriorityLabel(task.priority ?? 'low')}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium border border-white/20">
                    {getStatusLabel(task.status ?? 'todo')}
                  </span>
                </div>
              </div>
              {task.due_date && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Due Date</label>
                  <p className="text-white font-medium flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(task.due_date)}
                  </p>
                  {timeLeft && (
                    <p className={`text-sm flex items-center gap-2 ${
                      timeLeft.isOverdue 
                        ? 'text-red-400' 
                        : timeLeft.days === 0 && timeLeft.hours < 24 
                          ? 'text-yellow-400' 
                          : 'text-green-400'
                    }`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatTimeLeft(timeLeft)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-linear-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 p-6 w-full max-w-2xl m-4 shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Edit Task</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <AddTaskForm 
              onDone={() => setShowEditModal(false)} 
              editingTask={{
                ...task, 
                description: task.description || '',               
                priority: task.priority || 'low', 
                status: task.status || 'todo' 
              }}
              isEditing={true}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
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