'use client';

import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabaseClient';
import { useTaskContext } from '../contexts/TaskContext';

interface TaskFormInputs {
  title: string;
}

export default function AddTaskForm() {
  const { addTask } = useTaskContext();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormInputs>();

  const onSubmit = async (data: TaskFormInputs) => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }

      if (!session?.user) {
        throw new Error('No user session found');
      }

      const { data: newTask, error } = await supabase
        .from('tasks')
        .insert([
          {
            title: data.title,
            completed: false,
            user_id: session.user.id,
            created_at: new Date().toISOString() 
          }
        ])
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      if (newTask) {
        addTask(newTask);
        reset();
      } else {
        throw new Error('No task data returned from insert');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register('title', { required: 'Task title is required' })}
          placeholder="Add a new task..."
          className="w-full p-4 bg-white/5 border-2 border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all placeholder-gray-400 text-white"
        />
        {errors.title && (
          <p className="mt-2 text-sm text-red-400 bg-red-900/30 p-2 rounded-lg">{errors.title.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-white/10 text-white p-4 rounded-xl hover:bg-white/20 disabled:bg-white/5 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors text-lg font-medium shadow-lg"
      >
        {isSubmitting ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}