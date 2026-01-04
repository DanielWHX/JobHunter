import { useState } from 'react';
import { getQuadrant, QUADRANT_INFO } from '../types/task';

interface QuadrantSelectorProps {
  urgency: number;
  importance: number;
  onChange: (coords: { urgency: number; importance: number }) => void;
}

export default function QuadrantSelector({ urgency, importance, onChange }: QuadrantSelectorProps) {
  const [isDragging, setIsDragging] = useState(false);

  // 获取当前象限
  const currentQuadrant = getQuadrant(urgency, importance);
  const quadrantInfo = QUADRANT_INFO[currentQuadrant];

  /**
   * 处理点击事件 - 直接定位到点击位置
   */
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 计算百分比 (Y轴需要翻转，因为坐标系原点在左下角)
    const newUrgency = Math.round((x / rect.width) * 100);
    const newImportance = Math.round(((rect.height - y) / rect.height) * 100);

    // 限制范围 0-100
    onChange({
      urgency: Math.max(0, Math.min(100, newUrgency)),
      importance: Math.max(0, Math.min(100, newImportance))
    });
  };

  /**
   * 处理拖拽
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleClick(e);
  };

  return (
    <div className="space-y-3">
      {/* 当前象限提示 */}
      <div className={`p-3 rounded-lg border-2 ${quadrantInfo.bgColor} ${quadrantInfo.borderColor}`}>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full bg-${quadrantInfo.color}-500`}></div>
          <span className={`font-semibold ${quadrantInfo.textColor}`}>
            {quadrantInfo.label}
          </span>
        </div>
        <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
          {quadrantInfo.description}
        </p>
      </div>

      {/* 四象限图 */}
      <div className="relative">
        {/* 说明文字 */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">点击或拖拽来设置优先级</span>
          <span className="text-xs text-gray-500">
            紧急度: {urgency} | 重要度: {importance}
          </span>
        </div>

        {/* 主画布 */}
        <div
          className="relative w-full h-64 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-crosshair overflow-hidden"
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          {/* 四个象限背景 */}
          {/* B象限：左上 - 重要不紧急 */}
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-50 dark:bg-blue-900/10 border-r border-b border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <span className="text-4xl font-bold text-blue-300 dark:text-blue-700 select-none">B</span>
          </div>

          {/* A象限：右上 - 紧急且重要 */}
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-orange-50 dark:bg-orange-900/10 border-l border-b border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <span className="text-4xl font-bold text-orange-300 dark:text-orange-700 select-none">A</span>
          </div>

          {/* D象限：左下 - 不紧急不重要 */}
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gray-50 dark:bg-gray-900/10 border-r border-t border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-300 dark:text-gray-700 select-none">D</span>
          </div>

          {/* C象限：右下 - 紧急不重要 */}
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-yellow-50 dark:bg-yellow-900/10 border-l border-t border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <span className="text-4xl font-bold text-yellow-300 dark:text-yellow-700 select-none">C</span>
          </div>

          {/* 刻度线 */}
          {/* 竖直刻度线 (每25%) */}
          {[25, 50, 75].map((percent) => (
            <div
              key={`v-${percent}`}
              className="absolute top-0 bottom-0 border-l border-dashed border-gray-300 dark:border-gray-600"
              style={{ left: `${percent}%` }}
            />
          ))}

          {/* 水平刻度线 (每25%) */}
          {[25, 50, 75].map((percent) => (
            <div
              key={`h-${percent}`}
              className="absolute left-0 right-0 border-t border-dashed border-gray-300 dark:border-gray-600"
              style={{ top: `${percent}%` }}
            />
          ))}

          {/* 可拖拽的点 */}
          <div
            className="absolute w-5 h-5 bg-red-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 translate-y-1/2 cursor-move z-10 hover:scale-125 transition-transform"
            style={{
              left: `${urgency}%`,
              bottom: `${importance}%`,
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsDragging(true);
            }}
          >
            {/* 脉冲动画 */}
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
          </div>

          {/* 坐标轴标签 */}
          {/* Y轴标签（左侧）- Important */}
          <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 pr-2">
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">↑</span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 transform -rotate-90 whitespace-nowrap">
                Important
              </span>
            </div>
          </div>

          {/* X轴标签（底部）- Urgent */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full pt-2">
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
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>💡 <strong>使用提示：</strong></p>
        <ul className="list-disc list-inside ml-2 space-y-0.5">
          <li>点击图中任意位置设置优先级</li>
          <li>拖拽红点进行精确调整</li>
          <li>A象限：马上处理 | B象限：重点处理</li>
          <li>C象限：尽快处理 | D象限：尽量不做</li>
        </ul>
      </div>
    </div>
  );
}
