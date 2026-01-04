import { Task, TaskStatus, CATEGORY_LABELS, getQuadrant, QUADRANT_INFO } from '../types/task';

interface TaskListProps {
  tasks: Task[];
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onToggleStatus, onEdit, onDelete }: TaskListProps) {
  // 按象限和状态分组任务
  const groupedTasks = {
    A: tasks.filter(t => getQuadrant(t.urgency, t.importance) === 'A' && t.status !== TaskStatus.COMPLETED),
    B: tasks.filter(t => getQuadrant(t.urgency, t.importance) === 'B' && t.status !== TaskStatus.COMPLETED),
    C: tasks.filter(t => getQuadrant(t.urgency, t.importance) === 'C' && t.status !== TaskStatus.COMPLETED),
    D: tasks.filter(t => getQuadrant(t.urgency, t.importance) === 'D' && t.status !== TaskStatus.COMPLETED),
    completed: tasks.filter(t => t.status === TaskStatus.COMPLETED),
  };

  // 根据象限返回对应颜色样式
  const getQuadrantColor = (quadrant: 'A' | 'B' | 'C' | 'D') => {
    const info = QUADRANT_INFO[quadrant];
    return `border-${info.color}-500 ${info.bgColor}`;
  };

  // 根据分类返回对应颜色样式
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

  // 渲染单个任务卡片
  const renderTaskCard = (task: Task) => {
    const quadrant = getQuadrant(task.urgency, task.importance);
    const quadrantInfo = QUADRANT_INFO[quadrant];

    return (
      <div
        key={task.id}
        className={`border-l-4 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow ${getQuadrantColor(quadrant)}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start flex-1">
            {/* 完成状态复选框 */}
            <input
              type="checkbox"
              checked={task.status === TaskStatus.COMPLETED}
              onChange={() => onToggleStatus(task.id)}
              className="mt-1 mr-3 h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
            />

            {/* 任务信息 */}
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${task.status === TaskStatus.COMPLETED ? 'line-through text-gray-500' : 'text-gray-800 dark:text-white'}`}>
                {task.title}
              </h3>

              {task.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {task.description}
                </p>
              )}

              {/* 分类、象限和时长标签 */}
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                  {CATEGORY_LABELS[task.category]}
                </span>

                {/* 象限标签 */}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${quadrantInfo.bgColor} ${quadrantInfo.textColor} ${quadrantInfo.borderColor} border`}>
                  {quadrant}象限
                </span>

                {/* 紧急度/重要度 */}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  紧急{task.urgency} | 重要{task.importance}
                </span>

                {task.estimatedMinutes && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {task.estimatedMinutes} 分钟
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 编辑和删除按钮 */}
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
  };

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

      {/* 按象限分组显示任务 */}
      {/* A象限：紧急且重要 */}
      {groupedTasks.A.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center">
            <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
            A象限：紧急且重要 ({groupedTasks.A.length})
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {QUADRANT_INFO.A.description}
          </p>
          {groupedTasks.A.map(renderTaskCard)}
        </div>
      )}

      {/* B象限：重要不紧急 */}
      {groupedTasks.B.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            B象限：重要不紧急 ({groupedTasks.B.length})
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {QUADRANT_INFO.B.description}
          </p>
          {groupedTasks.B.map(renderTaskCard)}
        </div>
      )}

      {/* C象限：紧急不重要 */}
      {groupedTasks.C.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
            C象限：紧急不重要 ({groupedTasks.C.length})
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {QUADRANT_INFO.C.description}
          </p>
          {groupedTasks.C.map(renderTaskCard)}
        </div>
      )}

      {/* D象限：不紧急不重要 */}
      {groupedTasks.D.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-4 flex items-center">
            <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
            D象限：不紧急不重要 ({groupedTasks.D.length})
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {QUADRANT_INFO.D.description}
          </p>
          {groupedTasks.D.map(renderTaskCard)}
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

      {/* 空状态提示 */}
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
