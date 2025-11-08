'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  user_id: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskComplete: (taskId: string, currentStatus: boolean) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Initial fetch
    fetchTasks();

    // Set up real-time subscription
    const channel = supabase
      .channel('tasks-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        (payload) => {
          console.log('Change received!', payload);
          if (payload.eventType === 'INSERT') {
            setTasks(current => [payload.new as Task, ...current]);
          } else if (payload.eventType === 'DELETE') {
            setTasks(current => current.filter(task => task.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setTasks(current =>
              current.map(task =>
                task.id === payload.new.id ? { ...task, ...payload.new } : task
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (tasks) {
        setTasks(tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = (task: Task) => {
    // Check if task already exists to prevent duplicates
    setTasks(current => {
      if (current.some(t => t.id === task.id)) {
        return current;
      }
      return [task, ...current];
    });
  };

  const deleteTask = async (taskId: string) => {
    // Optimistic delete: remove locally first, then persist. Revert on error.
    const previous = tasks;
    setTasks(current => current.filter(t => t.id !== taskId));

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        // revert local state
        setTasks(previous);
        throw error;
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      // ensure previous state is restored if something unexpected occurred
      setTasks(previous);
    }
  };

  const toggleTaskComplete = async (taskId: string, currentStatus: boolean) => {
    // Optimistic update: update local state first for immediate UI feedback
    setTasks(current => current.map(t => t.id === taskId ? { ...t, completed: !currentStatus } : t));

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !currentStatus })
        .eq('id', taskId);

      if (error) {
        // revert optimistic change on error
        setTasks(current => current.map(t => t.id === taskId ? { ...t, completed: currentStatus } : t));
        throw error;
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask, toggleTaskComplete }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};