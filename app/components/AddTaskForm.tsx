'use client';

import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabaseClient';
import { useTaskContext } from '../contexts/TaskContext';
import { useEffect } from 'react';

interface TaskFormInputs {
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'low';
  due_date: string; 
  status: 'todo' | 'inprogress' | 'onhold' | 'completed';
}

type AddTaskFormProps = {
  onDone?: () => void;
  editingTask?: {
    id: string;
    title: string;
    description: string;
    priority: 'urgent' | 'high' | 'low';
    status: 'todo' | 'inprogress' | 'onhold' | 'completed';
    due_date?: string | null;
  };
  isEditing?: boolean;
};

export default function AddTaskForm({ onDone, editingTask, isEditing = false }: AddTaskFormProps) {
  const { addTask, updateTask } = useTaskContext();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<TaskFormInputs>();

  // Set form values when editing
  // Set form values when editing
useEffect(() => {
  if (isEditing && editingTask) {
    setValue('title', editingTask.title);
    setValue('description', editingTask.description || '');
    setValue('priority', editingTask.priority);
    setValue('status', editingTask.status);
    if (editingTask.due_date) {
      const localDate = new Date(editingTask.due_date);
      localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
      setValue('due_date', localDate.toISOString().slice(0, 16));
    } else {
      setValue('due_date', '');
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isEditing, editingTask?.id]); 

  const onSubmit = async (data: TaskFormInputs) => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session?.user) throw new Error('No user session found');

      if (isEditing && editingTask) {
        // Update existing task
        const { data: updatedTask, error } = await supabase
          .from('tasks')
          .update({
            title: data.title,
            description: data.description,
            priority: data.priority,
            due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
            status: data.status
          })
          .eq('id', editingTask.id)
          .select('*')
          .single();

        if (error) throw error;
        if (updatedTask) {
          updateTask(updatedTask);
          if (onDone) onDone();
        }
      } else {
        // Create new task
        const { data: newTask, error } = await supabase
          .from('tasks')
          .insert([
            {
              title: data.title,
              description: data.description,
              priority: data.priority,
              due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
              status: data.status,
              user_id: session.user.id,
              created_at: new Date().toISOString()
            }
          ])
          .select('*')
          .single();

        if (error) throw error;
        if (newTask) {
          addTask(newTask);
          reset();
          if (onDone) onDone();
        } else {
          throw new Error('No task data returned from insert');
        }
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} task:`, error);
    }
  };

  const buttonText = isSubmitting 
    ? (isEditing ? 'Updating...' : 'Adding...') 
    : (isEditing ? 'Update Task' : 'Add Task');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register('title', { required: 'Task title is required' })}
          placeholder="Task title..."
          className="w-full p-4 bg-white/5 border-2 border-white/10 rounded-xl focus:outline-none focus:ring-2 
                    focus:ring-white/30 focus:border-white/30 transition-all placeholder-gray-400 text-white"
        />
        {errors.title && (
          <p className="mt-2 text-sm text-red-400 bg-red-900/30 p-2 rounded-lg">{errors.title.message}</p>
        )}
      </div>
      <div>
        <label className="block mb-1 text-white text-sm">Description</label>
        <textarea
          {...register('description')}
          placeholder="Add a description..."
          rows={3}
          className="w-full p-3 bg-white/5 border-2 border-white/10 rounded-xl focus:outline-none focus:ring-2 
                    focus:ring-white/30 focus:border-white/30 transition-all placeholder-gray-400 text-white resize-none"
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 text-white text-sm">Priority</label>
          <select
            {...register('priority', { required: 'Priority is required' })}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl
                       text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors appearance-none"
          >
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
          {errors.priority && (
            <p className="mt-2 text-sm text-red-400 bg-red-900/30 p-2 rounded-lg">
              {errors.priority.message}
            </p>
          )}
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-white text-sm">Due Date</label>
          <input
            type="datetime-local"
            {...register('due_date', {
              validate: (value) => {
                if (value) {
                  const selected = new Date(value);
                  const now = new Date();
                  if (selected.getTime() < now.getTime()) return 'Due date must be in the future';
                }
                return true;
              }
            })}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white 
                      focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.due_date && (
            <p className="mt-2 text-sm text-red-400 bg-red-900/30 p-2 rounded-lg">
              {errors.due_date.message as string}
            </p>
          )}
        </div>
      </div>
      <div>
        <label className="block mb-1 text-white text-sm">Status</label>
        <select
          {...register('status', { required: 'Status is required' })}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none 
                      focus:ring-2 focus:ring-primary-500"
        >
          <option value="todo">Todo</option>
          <option value="inprogress">In Progress</option>
          <option value="onhold">On Hold</option>
          <option value="completed">Completed</option>
        </select>
        {errors.status && (
          <p className="mt-2 text-sm text-red-400 bg-red-900/30 p-2 rounded-lg">{errors.status.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-white/10 text-white p-4 rounded-xl hover:bg-white/20 disabled:bg-white/5 
                  disabled:text-gray-500 disabled:cursor-not-allowed transition-colors text-lg font-medium shadow-lg"
      >
        {buttonText}
      </button>
    </form>
  );
}
