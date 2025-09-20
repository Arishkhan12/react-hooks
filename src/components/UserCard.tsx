import { useState, useEffect } from 'react';
import { FiEdit2, FiCheck, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  status: 'In Progress' | 'Completed' | 'Blocked';
}

interface UserCardProps {
  name: string;
  role: string;
  onUpdate?: (newName: string, newRole: string) => void;
}

export default function UserCard({ name, role, onUpdate }: UserCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editRole, setEditRole] = useState(role);
  
  // Todo functionality
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('todo-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // User edit functions
  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editName, editRole);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(name);
    setEditRole(role);
    setIsEditing(false);
  };

  // Todo functions
  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now(),
        title: newTaskTitle.trim(),
        completed: false,
        status: 'In Progress'
      };
      setTasks(prev => [newTask, ...prev]);
      setNewTaskTitle('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { 
            ...task, 
            completed: !task.completed,
            status: !task.completed ? 'Completed' : 'In Progress'
          }
        : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const startEditTask = (id: number, currentTitle: string) => {
    setEditingTask(id);
    setEditTaskTitle(currentTitle);
  };

  const saveEditTask = () => {
    if (editTaskTitle.trim() && editingTask) {
      setTasks(prev => prev.map(task => 
        task.id === editingTask 
          ? { ...task, title: editTaskTitle.trim() }
          : task
      ));
      setEditingTask(null);
      setEditTaskTitle('');
    }
  };

  const cancelEditTask = () => {
    setEditingTask(null);
    setEditTaskTitle('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editingTask) {
        saveEditTask();
      } else {
        addTask();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 scrollbar-thin">
      <div className="max-w-6xl mx-auto px-4">
        {/* User Profile Card */}
        <div className="relative overflow-hidden rounded-3xl mb-8 shadow-2xl transform hover:scale-105 transition-all duration-300 w-full mx-auto animate-fade-in-up">
          {/* Background with gradient overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/70 via-blue-600/70 to-indigo-700/70" />
          
          {/* Content */}
          <div className="relative z-10 p-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                {/* Avatar with animation */}
                <div className="relative group">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 shadow-lg transform group-hover:scale-110 transition-all duration-300">
                    <span className="text-white font-bold text-3xl">
                      {name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -inset-2 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-slow" />
                </div>
                
                <div className="text-white">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg"
                        placeholder="Enter name"
                      />
                      <input
                        type="text"
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg"
                        placeholder="Enter role"
                      />
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-4xl font-bold mb-3 drop-shadow-lg">{name}</h2>
                      <p className="text-xl text-white/90 drop-shadow-md">{role}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="p-4 bg-green-500/80 hover:bg-green-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 backdrop-blur-sm"
                    >
                      <FiCheck className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-4 bg-red-500/80 hover:bg-red-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 backdrop-blur-sm"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-4 bg-white/20 hover:bg-white/30 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 backdrop-blur-sm"
                  >
                    <FiEdit2 className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Todo Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            My To-Do List
          </h1>
          <p className="text-gray-600">Stay organized and productive</p>
        </div>
        
        {/* Add Task Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
          <div className="flex gap-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              className="flex-1 px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
            />
            <button
              onClick={addTask}
              className="relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500"
            >
              <FiPlus className="w-5 h-5" />
              Add Task
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <FiPlus className="w-12 h-12 text-blue-400" />
              </div>
              <p className="text-xl text-gray-500 mb-2">No tasks yet</p>
              <p className="text-gray-400">Add your first task above to get started!</p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div
                key={task.id}
                className={`group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 transform hover:scale-[1.02] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl animate-fade-in-up ${
                  task.completed ? 'border-green-200 bg-green-50/50' : 'border-blue-200'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="w-6 h-6 text-blue-600 rounded-lg focus:ring-blue-500 focus:ring-2 transform hover:scale-110 transition-all duration-200"
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
                        <div className="flex items-center space-x-3">
                          <span
                            className={`text-lg font-medium ${
                              task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                            }`}
                          >
                            {task.title}
                          </span>
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
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {editingTask !== task.id && (
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => startEditTask(task.id, task.title)}
                        className="p-3 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-xl transition-all duration-200 transform hover:scale-110"
                        title="Edit task"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-3 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-xl transition-all duration-200 transform hover:scale-110"
                        title="Delete task"
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

        {/* Stats */}
        {tasks.length > 0 && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Progress Overview</h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="group">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <span className="text-2xl font-bold text-white">{tasks.length}</span>
                </div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              </div>
              <div className="group">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <span className="text-2xl font-bold text-white">
                    {tasks.filter(t => t.completed).length}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
              </div>
              <div className="group">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <span className="text-2xl font-bold text-white">
                    {tasks.filter(t => !t.completed).length}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}