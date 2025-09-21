interface Task {
  id: number;
  title: string;
  completed: boolean;
  status: 'In Progress' | 'Completed' | 'Blocked';
}

interface TaskStatsProps {
  tasks: Task[];
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const inProgress = tasks.filter(t => !t.completed).length;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  if (total === 0) return null;

  return (
    <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20" aria-live="polite">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Progress Overview</h3>
      <div className="grid grid-cols-3 gap-6 text-center">
        <div className="group">
          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
            <span className="text-2xl font-bold text-white">{total}</span>
          </div>
          <p className="text-sm font-medium text-gray-600">Total Tasks</p>
        </div>
        <div className="group">
          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
            <span className="text-2xl font-bold text-white">{completed}</span>
          </div>
          <p className="text-sm font-medium text-gray-600">Completed</p>
        </div>
        <div className="group">
          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
            <span className="text-2xl font-bold text-white">{inProgress}</span>
          </div>
          <p className="text-sm font-medium text-gray-600">In Progress</p>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}