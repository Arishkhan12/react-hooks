import { useState, useEffect } from 'react';
import { FiEdit2, FiCheck, FiX, FiPlus } from 'react-icons/fi';
import TaskList from './TaskList';
import TaskStats from './TaskStats';

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

interface UserCardProps {
  name: string;
  role: string;
  onUpdate?: (newName: string, newRole: string) => void;
}

export default function UserCard({ name, role, onUpdate }: UserCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editRole, setEditRole] = useState(role);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');

  // Load tasks from localStorage on component mount
  useEffect(() => {
    console.log('🔄 Loading tasks from localStorage...');
    const savedTasks = localStorage.getItem('todo-tasks');
    console.log('📦 Raw saved data:', savedTasks);
    
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        console.log('✅ Parsed tasks:', parsedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error('❌ Error parsing saved tasks:', error);
        setTasks([]);
      }
    } else {
      console.log('📭 No saved tasks found');
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    console.log('💾 Saving tasks to localStorage:', tasks);
    if (tasks.length > 0) {
      localStorage.setItem('todo-tasks', JSON.stringify(tasks));
      console.log('✅ Tasks saved successfully');
    } else {
      console.log('⚠️ No tasks to save (or empty array)');
    }
  }, [tasks]);

  // Update edit fields when props change
  useEffect(() => {
    setEditName(name);
    setEditRole(role);
  }, [name, role]);

  // User edit functions
  const handleSave = () => {
    if (!editName.trim() || !editRole.trim()) {
      alert('Name and role cannot be empty.');
      return;
    }
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
    if (!newTaskTitle.trim()) {
      alert('Task title cannot be empty.');
      return;
    }
    
    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      completed: false,
      status: 'In Progress',
      priority: newTaskPriority,
      dueDate: newTaskDueDate || undefined,
      createdAt: new Date().toISOString(),
      description: newTaskDescription.trim() || undefined
    };
    
    console.log('🆕 Adding new task:', newTask);
    setTasks(prevTasks => {
      const newTasks = [newTask, ...prevTasks];
      console.log('📝 Updated tasks array:', newTasks);
      return newTasks;
    });
    
    // Clear form
    setNewTaskTitle('');
    setNewTaskPriority('Medium');
    setNewTaskDueDate('');
    setNewTaskDescription('');
  };

  const toggleTask = (id: number) => {
    console.log('🔄 Toggling task:', id);
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              status: !task.completed ? 'Completed' : 'In Progress'
            }
          : task
      )
    );
  };

  const deleteTask = (id: number) => {
    console.log('🗑️ Deleting task:', id);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const updateTaskPriority = (id: number, priority: 'Low' | 'Medium' | 'High') => {
    console.log('🎯 Updating task priority:', id, priority);
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, priority } : task
      )
    );
  };

  const updateTaskStatus = (id: number, status: 'In Progress' | 'Completed' | 'Blocked') => {
    console.log('📊 Updating task status:', id, status);
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id 
          ? { 
              ...task, 
              status,
              completed: status === 'Completed'
            } 
          : task
      )
    );
  };

  const startEditTask = (id: number, currentTitle: string) => {
    setEditingTask(id);
    setEditTaskTitle(currentTitle);
  };

  const saveEditTask = () => {
    if (!editTaskTitle.trim()) {
      alert('Task title cannot be empty.');
      return;
    }
    if (editingTask) {
      console.log('✏️ Editing task:', editingTask, editTaskTitle);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === editingTask
            ? { ...task, title: editTaskTitle.trim() }
            : task
        )
      );
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

  // Debug function - you can remove this later
  const debugClearStorage = () => {
    localStorage.removeItem('todo-tasks');
    localStorage.removeItem('todo-user');
    setTasks([]);
    console.log('🧹 Cleared all localStorage data');
  };

  return (
    <div
      className="min-h-screen py-8 scrollbar-thin"
      aria-labelledby="profile-title"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1751182782142-000e62239d85?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        







        <div className="relative overflow-hidden rounded-3xl mb-8 shadow-2xl transform hover:scale-105 transition-all duration-300 w-full mx-auto animate-fade-in-up">
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
          <div className="relative z-10 p-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
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
                        aria-label="Edit user name"
                      />
                      <input
                        type="text"
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg"
                        placeholder="Enter role"
                        aria-label="Edit user role"
                      />
                    </div>
                  ) : (
                    <div>
                      <h2 id="profile-title" className="text-4xl font-bold mb-3 drop-shadow-lg">{name}</h2>
                      <p className="text-xl text-white/90 drop-shadow-md">{role}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="p-4 bg-green-500/80 hover:bg-green-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 backdrop-blur-sm"
                      aria-label="Save user info"
                    >
                      <FiCheck className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-4 bg-red-500/80 hover:bg-red-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 backdrop-blur-sm"
                      aria-label="Cancel editing user info"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-4 bg-white/20 hover:bg-white/30 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 backdrop-blur-sm"
                    aria-label="Edit user info"
                  >
                    <FiEdit2 className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2" id="todo-title">
            My To-Do List
          </h1>
          <p className="text-gray-600">Stay organized and productive</p>
        </div>
        <form
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/20"
          role="form"
          aria-labelledby="todo-title"
          onSubmit={e => { e.preventDefault(); addTask(); }}
        >
          <div className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new task..."
                className="flex-1 px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                aria-label="New task title"
              />
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as typeof newTaskPriority)}
                className="px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                aria-label="Task priority"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>
            <div className="flex gap-4">
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                aria-label="Due date"
              />
              <input
                type="text"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Description (optional)"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                aria-label="Task description"
              />
            </div>
            <button
              type="submit"
              className="w-full relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500"
              aria-label="Add task"
            >
              <FiPlus className="w-5 h-5" />
              Add Task
            </button>
          </div>
        </form>
        <TaskList
          tasks={tasks}
          editingTask={editingTask}
          editTaskTitle={editTaskTitle}
          startEditTask={startEditTask}
          saveEditTask={saveEditTask}
          cancelEditTask={cancelEditTask}
          setEditTaskTitle={setEditTaskTitle}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
          handleKeyPress={handleKeyPress}
          updateTaskPriority={updateTaskPriority}
          updateTaskStatus={updateTaskStatus}
        />
        <TaskStats tasks={tasks} />
      </div>
    </div>
  );
}