import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { priorityColors, statuses } from './utils';

interface TaskKanbanBoardProps {
  tasks: any[];
  filterStatus: string;
  onDragEnd: (result: DropResult) => void;
  openEdit: (task: any) => void;
  deleteTask: (id: string) => void;
}

export default function TaskKanbanBoard({
  tasks, filterStatus, onDragEnd, openEdit, deleteTask
}: TaskKanbanBoardProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pb-4 items-start min-h-[60vh]">
        {(filterStatus ? [filterStatus] : statuses).map((status) => {
          const columnTasks = tasks.filter((t: any) => t.status === status);
          return (
            <div key={status} className="bg-gray-50/80 dark:bg-dark-300/30 rounded-2xl p-4 flex flex-col gap-3 border border-gray-100 dark:border-dark-400">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-gray-700 dark:text-gray-200 capitalize flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${status === 'todo' ? 'bg-amber-400' : status === 'in-progress' ? 'bg-blue-400' : status === 'completed' ? 'bg-green-400' : 'bg-red-400'}`} />
                  {status.replace('-', ' ')}
                </h2>
                <span className="bg-white dark:bg-dark-400 text-xs py-1 px-2.5 rounded-full font-bold text-gray-500 shadow-sm">
                  {columnTasks.length}
                </span>
              </div>
              
              <Droppable droppableId={status} isDropDisabled={status === 'overdue'}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 min-h-[150px] transition-all duration-200 rounded-xl ${snapshot.isDraggingOver ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}
                  >
                    {columnTasks.map((task: any, index: number) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{ ...provided.draggableProps.style }}
                              className={`mb-3 glass-card p-4 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'ring-2 ring-primary-500 shadow-xl opacity-90 scale-[1.02]' : ''}`}
                            >
                            <div className="flex flex-col gap-2">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className={`font-semibold text-sm text-gray-900 dark:text-white leading-tight ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                                  {task.title}
                                </h3>
                                <div className="flex items-center shrink-0">
                                  <button onClick={() => openEdit(task)} className="p-1.5 text-gray-400 hover:text-primary-500 transition-colors">
                                    <HiOutlinePencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => deleteTask(task.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                                    <HiOutlineTrash className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              
                              {task.description && (
                                <p className="text-xs text-gray-500 dark:text-dark-200 line-clamp-2">{task.description}</p>
                              )}
                              
                              <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50 dark:border-dark-400">
                                <span className={`badge text-[10px] px-2 py-0.5 ${priorityColors[task.priority]}`}>{task.priority}</span>
                                {task.dueDate && (
                                  <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                    🗓️ {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
