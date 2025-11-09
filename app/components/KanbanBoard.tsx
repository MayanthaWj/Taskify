"use client";

import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useTaskContext } from '../contexts/TaskContext';
import TaskCard from './TaskCard';
import { JSX, useState } from 'react';
import { Dialog } from '@headlessui/react';
import AddTaskForm from './AddTaskForm';

const COLUMNS: { 
  key: 'todo' | 'inprogress' | 'onhold' | 'completed'; 
  title: string;
  icon: (className: string) => JSX.Element;
}[] = [
  { 
    key: 'todo', 
    title: 'Todo',
    icon: (className) => (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  },
  { 
    key: 'inprogress', 
    title: 'In Progress',
    icon: (className) => (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    key: 'onhold', 
    title: 'On Hold',
    icon: (className) => (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    key: 'completed', 
    title: 'Completed',
    icon: (className) => (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
];

export default function KanbanBoard() {
  const { tasks, updateTaskStatus } = useTaskContext();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid droppable
    if (!destination) return;

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Update task status in the database
    await updateTaskStatus(draggableId, destination.droppableId as 'todo' | 'inprogress' | 'onhold' | 'completed');
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white"> MyTasks</h1>
        <button
          onClick={() => setIsAddTaskModalOpen(true)}
          aria-label="Add task"
          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white border border-white/20 
                    rounded-lg hover:bg-white/10 transition duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path 
                fillRule="evenodd" 
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" 
                clipRule="evenodd" 
            />
          </svg>
          <span className="font-semibold">Add Task</span>
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {COLUMNS.map((col) => (
            <div key={col.key} className="bg-white/6 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  {col.icon(`w-6 h-6 ${
                    col.key === 'todo' ? 'text-blue-400' :
                    col.key === 'inprogress' ? 'text-yellow-400' :
                    col.key === 'onhold' ? 'text-orange-400' :
                    'text-green-400'
                  }`)}
                  <h3 className="text-base font-bold text-white tracking-wide">{col.title}</h3>
                </div>
                <span className={`text-sm font-medium bg-white/10 px-3 py-1 rounded-full border ${
                  col.key === 'todo' ? 'text-blue-300 border-blue-500/30' :
                  col.key === 'inprogress' ? 'text-yellow-300 border-yellow-500/30' :
                  col.key === 'onhold' ? 'text-orange-300 border-orange-500/30' :
                  'text-green-300 border-green-500/30'
                }`}>
                  {tasks.filter(t => (t.status ?? 'todo') === col.key).length}
                </span>
              </div>

              <Droppable droppableId={col.key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-4 space-y-3 min-h-[200px] transition-colors rounded-b-xl
                      ${snapshot.isDraggingOver ? 'bg-white/10' : ''}`}
                  >
                    {tasks
                      .filter(t => (t.status ?? 'todo') === col.key)
                      .map((task, index) => (
                        <TaskCard key={task.id} task={task} index={index} />
                      ))}
                    {tasks.filter(t => (t.status ?? 'todo') === col.key).length === 0 && (
                      <div className="text-sm text-white/80">No tasks</div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <Dialog
        open={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-gray-900/75" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative mx-auto max-w-md rounded-lg bg-gray-800 p-6 w-full">
            <button
              type="button"
              onClick={() => setIsAddTaskModalOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 inline-flex items-center justify-center p-2 rounded-full bg-white/6 hover:bg-white/10 
                      text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path 
                  fillRule="evenodd" 
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
            </button>
            <Dialog.Title className="text-lg font-medium text-white mb-4">
              Add New Task
            </Dialog.Title>
            <AddTaskForm onDone={() => setIsAddTaskModalOpen(false)} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
