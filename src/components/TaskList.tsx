import { useState } from 'react';
import { FiEdit2, FiCheck, FiX, FiTrash2, FiCalendar, FiFlag,  FiFilter, FiSearch  } from 'react-icons/fi';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  status: 'In Progress' | 'Completed' | 'Blocked';
  priority?: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  createdAt?: string;
  category?: string;
  description?: string;
}

interface TaskListProps {
  tasks: Task[];
  editingTask: number | null;
  editTaskTitle: string;
  startEditTask: (id: number, title: string) => void;
  saveEditTask: () => void;
  cancelEditTask: () => void;
  setEditTaskTitle: (title: string) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  updateTaskPriority?: (id: number, priority: 'Low' | 'Medium' | 'High') => void;
  updateTaskStatus?: (id: number, status: 'In Progress' | 'Completed' | 'Blocked') => void;
}

export default function TaskList({
  tasks,
  editingTask,
  editTaskTitle,
  startEditTask,
  saveEditTask,
  cancelEditTask,
  setEditTaskTitle,
  toggleTask,
  deleteTask,
  handleKeyPress,
  updateTaskPriority,
  updateTaskStatus,
}: TaskListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'In Progress' | 'Completed' | 'Blocked'>('All');
  const [filterPriority, setFilterPriority] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [sortBy, setSortBy] = useState<'created' | 'dueDate' | 'priority' | 'alphabetical'>('created');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
      const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          { const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          return (priorityOrder[b.priority || 'Low'] || 0) - (priorityOrder[a.priority || 'Low'] || 0); }
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return b.id - a.id; // newest first
      }
    });

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'High': return <FiFlag className="w-3 h-3 text-red-600" />;
      case 'Medium': return <FiFlag className="w-3 h-3 text-yellow-600" />;
      case 'Low': return <FiFlag className="w-3 h-3 text-green-600" />;
      default: return null;
    }
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !tasks.find(t => t.dueDate === dueDate)?.completed;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
          <FiEdit2 className="w-12 h-12 text-blue-400" />
        </div>
        <p className="text-xl text-gray-500 mb-2">No tasks yet</p>
        <p className="text-gray-400">Add your first task above to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
              showFilters 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            <FiFilter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Status</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as typeof filterPriority)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="created">Created Date</option>
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task Count */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Showing {filteredAndSortedTasks.length} of {tasks.length} tasks
        </span>
        <span>
          {tasks.filter(t => t.completed).length} completed
        </span>
      </div>

      {/* Tasks */}
      <div className="space-y-4">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No tasks match your current filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('All');
                setFilterPriority('All');
              }}
              className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          filteredAndSortedTasks.map((task, index) => (
            <div
              key={task.id}
              className={`group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border transform hover:scale-[1.02] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl animate-fade-in-up ${
                task.completed 
                  ? 'border-green-200 bg-green-50/50' 
                  : isOverdue(task.dueDate)
                  ? 'border-red-200 bg-red-50/50'
                  : 'border-blue-200 border-white/20'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-6 h-6 text-blue-600 rounded-lg focus:ring-blue-500 focus:ring-2 transform hover:scale-110 transition-all duration-200"
                      aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                    />
                    {task.completed && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <FiCheck className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    {editingTask === task.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editTaskTitle}
                          onChange={(e) => setEditTaskTitle(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          autoFocus
                        />
                        <button
                          onClick={saveEditTask}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-all duration-200"
                        >
                          <FiCheck className="w-5 h-5" />
                        </button>
                        <button
                          onClick={cancelEditTask}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-all duration-200"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Title and Priority */}
                        <div className="flex items-start space-x-3">
                          <span
                            className={`text-lg font-medium flex-1 ${
                              task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                            }`}
                          >
                            {task.title}
                          </span>
                          {task.priority && (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {getPriorityIcon(task.priority)}
                              {task.priority}
                            </span>
                          )}
                        </div>

                        {/* Status and Due Date */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                task.status === 'Completed'
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : task.status === 'Blocked'
                                  ? 'bg-red-100 text-red-800 border border-red-200'
                                  : 'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}
                            >
                              {task.status}
                            </span>
                            
                            {updateTaskStatus && (
                              <select
                                value={task.status}
                                onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                                className="text-xs px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Blocked">Blocked</option>
                              </select>
                            )}
                          </div>

                          {task.dueDate && (
                            <div className={`flex items-center gap-1 text-sm ${
                              isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-500'
                            }`}>
                              <FiCalendar className="w-4 h-4" />
                              {formatDate(task.dueDate)}
                              {isOverdue(task.dueDate) && (
                                <span className="text-xs bg-red-100 text-red-600 px-1 rounded">
                                  Overdue
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        {task.description && (
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                            {task.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {editingTask !== task.id && (
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {updateTaskPriority && (
                      <select
                        value={task.priority || 'Low'}
                        onChange={(e) => updateTaskPriority(task.id, e.target.value as 'Low' | 'Medium' | 'High')}
                        className="text-xs px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        title="Change priority"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Med</option>
                        <option value="High">High</option>
                      </select>
                    )}
                    
                    <button
                      onClick={() => startEditTask(task.id, task.title)}
                      className="p-3 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-xl transition-all duration-200 transform hover:scale-110"
                      title="Edit task"
                      aria-label={`Edit task "${task.title}"`}
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-3 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-xl transition-all duration-200 transform hover:scale-110"
                      title="Delete task"
                      aria-label={`Delete task "${task.title}"`}
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}