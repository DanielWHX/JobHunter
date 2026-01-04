import { Task, getQuadrant, QUADRANT_INFO, CATEGORY_LABELS } from '../types/task';

interface MatrixViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function MatrixView({ tasks, onTaskClick }: MatrixViewProps) {
  // 按象限分组任务
  const tasksByQuadrant = {
    A: tasks.filter(t => getQuadrant(t.urgency, t.importance) === 'A'),
    B: tasks.filter(t => getQuadrant(t.urgency, t.importance) === 'B'),
    C: tasks.filter(t => getQuadrant(t.urgency, t.importance) === 'C'),
    D: tasks.filter(t => getQuadrant(t.urgency, t.importance) === 'D'),
  };

  // 渲染任务点
  const renderTaskDot = (task: Task) => {
    const quadrant = getQuadrant(task.urgency, task.importance);
    const quadrantInfo = QUADRANT_INFO[quadrant];

    return (
      <div
        key={task.id}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
        style={{
          left: `${task.urgency}%`,
          bottom: `${task.importance}%`,
        }}
        onClick={() => onTaskClick(task)}
        title={task.title}
      >
        {/* 任务点 */}
        <div className={`w-3 h-3 rounded-full bg-${quadrantInfo.color}-500 border-2 border-white shadow-lg group-hover:scale-150 transition-transform z-10`}></div>

        {/* 悬浮卡片 */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-20">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 min-w-[200px] border border-gray-200 dark:border-gray-700">
            <div className="font-semibold text-gray-800 dark:text-white mb-1 line-clamp-2">
              {task.title}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className={`px-2 py-0.5 rounded-full ${quadrantInfo.bgColor} ${quadrantInfo.textColor}`}>
                {quadrant}象限
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {CATEGORY_LABELS[task.category]}
              </span>
            </div>
            {task.estimatedMinutes && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                预计 {task.estimatedMinutes} 分钟
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 统计信息 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border-2 border-orange-300 dark:border-orange-700">
          <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">A象限</div>
          <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{tasksByQuadrant.A.length}</div>
          <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">紧急且重要</div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-2 border-blue-300 dark:border-blue-700">
          <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">B象限</div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{tasksByQuadrant.B.length}</div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">重要不紧急</div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border-2 border-yellow-300 dark:border-yellow-700">
          <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">C象限</div>
          <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{tasksByQuadrant.C.length}</div>
          <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">紧急不重要</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-4 border-2 border-gray-300 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">D象限</div>
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{tasksByQuadrant.D.length}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">不紧急不重要</div>
        </div>
      </div>

      {/* 四象限矩阵 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          任务分布矩阵 ({tasks.length} 个任务)
        </h3>

        <div className="relative w-full" style={{ paddingBottom: '75%' }}>
          {/* 主画布 */}
          <div className="absolute inset-0 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            {/* 四个象限背景 */}
            {/* B象限：左上 - 重要不紧急 */}
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-50 dark:bg-blue-900/10 border-r border-b border-gray-300 dark:border-gray-600 flex items-center justify-center">
              <span className="text-6xl font-bold text-blue-200 dark:text-blue-800 select-none">B</span>
            </div>

            {/* A象限：右上 - 紧急且重要 */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-orange-50 dark:bg-orange-900/10 border-l border-b border-gray-300 dark:border-gray-600 flex items-center justify-center">
              <span className="text-6xl font-bold text-orange-200 dark:text-orange-800 select-none">A</span>
            </div>

            {/* D象限：左下 - 不紧急不重要 */}
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gray-50 dark:bg-gray-900/10 border-r border-t border-gray-300 dark:border-gray-600 flex items-center justify-center">
              <span className="text-6xl font-bold text-gray-200 dark:text-gray-800 select-none">D</span>
            </div>

            {/* C象限：右下 - 紧急不重要 */}
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-yellow-50 dark:bg-yellow-900/10 border-l border-t border-gray-300 dark:border-gray-600 flex items-center justify-center">
              <span className="text-6xl font-bold text-yellow-200 dark:text-yellow-800 select-none">C</span>
            </div>

            {/* 刻度线 */}
            {[25, 50, 75].map((percent) => (
              <div
                key={`v-${percent}`}
                className="absolute top-0 bottom-0 border-l border-dashed border-gray-300 dark:border-gray-600"
                style={{ left: `${percent}%` }}
              />
            ))}

            {[25, 50, 75].map((percent) => (
              <div
                key={`h-${percent}`}
                className="absolute left-0 right-0 border-t border-dashed border-gray-300 dark:border-gray-600"
                style={{ top: `${percent}%` }}
              />
            ))}

            {/* 渲染所有任务点 */}
            {tasks.map(renderTaskDot)}

            {/* 坐标轴标签 */}
            <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 pr-3">
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">↑</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 transform -rotate-90 whitespace-nowrap">
                  Important
                </span>
              </div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full pt-3">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Urgent
                </span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">→</span>
              </div>
            </div>
          </div>
        </div>

        {/* 提示信息 */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">💡 <strong>使用提示：</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>鼠标悬停在点上可以查看任务详情</li>
            <li>点击任务点可以编辑任务</li>
            <li>任务分布越靠右上角，优先级越高</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
