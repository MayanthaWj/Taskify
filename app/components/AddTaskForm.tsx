'use client';

import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface TaskFormInputs {
  title: string;
}

export default function AddTaskForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormInputs>();

  const onSubmit = async (data: TaskFormInputs) => {
    try {
      // Get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }

      if (!session?.user) {
        throw new Error('No user session found');
      }

      const { error } = await supabase
        .from('tasks')
        .insert([
          {
            title: data.title,
            completed: false,
            user_id: session.user.id
          }
        ]);

      if (error) {
        throw error;
      }

      reset();
      router.refresh();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
      <div>
        <input
          {...register('title', { required: 'Task title is required' })}
          placeholder="Add a new task..."
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
      >
        {isSubmitting ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}