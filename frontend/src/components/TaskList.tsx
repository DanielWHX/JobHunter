import { Task, TaskStatus, CATEGORY_LABELS, PRIORITY_LABELS } from '../types/task';

interface TaskListProps {
  tasks: Task[];
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onToggleStatus, onEdit, onDelete }: TaskListProps) {
  // 按优先级和状态分组
  const groupedTasks = {
    urgent_important: tasks.filter(t => t.priority === 'urgent_important' && t.status !== TaskStatus.COMPLETED),
    not_urgent_important: tasks.filter(t => t.priority === 'not_urgent_important' && t.status !== TaskStatus.COMPLETED),
    urgent_not_important: tasks.filter(t => t.priority === 'urgent_not_important' && t.status !== TaskStatus.COMPLETED),
    not_urgent_not_important: tasks.filter(t => t.priority === 'not_urgent_not_important' && t.status !== TaskStatus.COMPLETED),
    completed: tasks.filter(t => t.status === TaskStatus.COMPLETED),
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent_important': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'not_urgent_important': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'urgent_not_important': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'not_urgent_not_important': return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
      default: return 'border-gray-300 bg-white dark:bg-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'job_learning': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'school': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'identity': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'daily_life': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'health': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'personal_dev': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const renderTaskCard = (task: Task) => (
    <div
      key={task.id}
      className={`border-l-4 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow ${getPriorityColor(task.priority)}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1">
          {/* 复选框 */}
          <input
            type="checkbox"
            checked={task.status === TaskStatus.COMPLETED}
            onChange={() => onToggleStatus(task.id)}
            className="mt-1 mr-3 h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
          />

          {/* 任务内容 */}
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${task.status === TaskStatus.COMPLETED ? 'line-through text-gray-500' : 'text-gray-800 dark:text-white'}`}>
              {task.title}
            </h3>

            {task.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {task.description}
              </p>
            )}

            {/* 标签 */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                {CATEGORY_LABELS[task.category]}
              </span>

              {task.estimatedMinutes && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {task.estimatedMinutes} 分钟
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 ml-2">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30"
            title="编辑"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
            title="删除"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">总任务</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">{tasks.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">待完成</div>
          <div className="text-2xl font-bold text-blue-600">{tasks.filter(t => t.status !== TaskStatus.COMPLETED).length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">已完成</div>
          <div className="text-2xl font-bold text-green-600">{groupedTasks.completed.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">完成率</div>
          <div className="text-2xl font-bold text-purple-600">
            {tasks.length > 0 ? Math.round((groupedTasks.completed.length / tasks.length) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* 紧急且重要 */}
      {groupedTasks.urgent_important.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            紧急且重要 ({groupedTasks.urgent_important.length})
          </h2>
          {groupedTasks.urgent_important.map(renderTaskCard)}
        </div>
      )}

      {/* 重要不紧急 */}
      {groupedTasks.not_urgent_important.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            重要不紧急 ({groupedTasks.not_urgent_important.length})
          </h2>
          {groupedTasks.not_urgent_important.map(renderTaskCard)}
        </div>
      )}

      {/* 紧急不重要 */}
      {groupedTasks.urgent_not_important.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
            紧急不重要 ({groupedTasks.urgent_not_important.length})
          </h2>
          {groupedTasks.urgent_not_important.map(renderTaskCard)}
        </div>
      )}

      {/* 不紧急不重要 */}
      {groupedTasks.not_urgent_not_important.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-4 flex items-center">
            <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
            不紧急不重要 ({groupedTasks.not_urgent_not_important.length})
          </h2>
          {groupedTasks.not_urgent_not_important.map(renderTaskCard)}
        </div>
      )}

      {/* 已完成 */}
      {groupedTasks.completed.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            已完成 ({groupedTasks.completed.length})
          </h2>
          {groupedTasks.completed.map(renderTaskCard)}
        </div>
      )}

      {/* 空状态 */}
      {tasks.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">暂无任务</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">开始创建你的第一个任务吧!</p>
        </div>
      )}
    </div>
  );
}
