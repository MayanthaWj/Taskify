'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Task {
  id: string;
  title: string;
  priority?: 'urgent' | 'high' | 'low';
  status?: 'todo' | 'inprogress' | 'onhold' | 'completed';
  due_date?: string | null;
  created_at: string;
  user_id: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => Promise<void>;
  updateTaskStatus: (taskId: string, newStatus: Task['status']) => Promise<void>;
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
    setTasks(current => {
      if (current.some(t => t.id === task.id)) {
        return current;
      }
      return [task, ...current];
    });
  };

  const deleteTask = async (taskId: string) => {
    const previous = tasks;
    setTasks(current => current.filter(t => t.id !== taskId));

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        setTasks(previous);
        throw error;
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setTasks(previous);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    const previous = tasks;
    setTasks(current => current.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) {
        // revert optimistic change on error
        setTasks(previous);
        throw error;
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      setTasks(previous);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask, updateTaskStatus }}>
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