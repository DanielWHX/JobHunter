import { TaskTemplate, CATEGORY_LABELS, getQuadrant, QUADRANT_INFO } from '../types/task';

interface TemplateSelectorProps {
  templates: TaskTemplate[];
  onSelectTemplate: (template: TaskTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

export default function TemplateSelector({ templates, onSelectTemplate, onDeleteTemplate }: TemplateSelectorProps) {
  if (templates.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
        暂无模板，创建任务后可保存为模板
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        快速模板 ({templates.length})
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {templates.map((template) => {
          const quadrant = getQuadrant(template.urgency, template.importance);
          const quadrantInfo = QUADRANT_INFO[quadrant];

          return (
            <div
              key={template.id}
              className="group relative flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer border border-gray-200 dark:border-gray-600"
              onClick={() => onSelectTemplate(template)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800 dark:text-white truncate">
                    {template.name}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${quadrantInfo.bgColor} ${quadrantInfo.textColor}`}>
                    {quadrant}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {CATEGORY_LABELS[template.category]}
                  </span>
                  {template.estimatedMinutes && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      • {template.estimatedMinutes}分钟
                    </span>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    • 使用{template.usageCount}次
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTemplate(template.id);
                }}
                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                title="删除模板"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
