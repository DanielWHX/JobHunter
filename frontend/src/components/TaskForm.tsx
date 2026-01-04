import { useState, useEffect } from 'react';
import {
  Task,
  CreateTaskInput,
  TaskCategory,
  CATEGORY_LABELS,
  migratePriorityToCoordinates,
  TaskTemplate
} from '../types/task';
import QuadrantSelector from './QuadrantSelector';
import TemplateSelector from './TemplateSelector';

interface TaskFormProps {
  onSubmit: (input: CreateTaskInput) => void;
  initialData?: Task;  // 有值时为编辑模式
  onCancel?: () => void;
  templates?: TaskTemplate[];
  onSaveAsTemplate?: (input: CreateTaskInput, name: string) => void;
  onDeleteTemplate?: (id: string) => void;
}

export default function TaskForm({
  onSubmit,
  initialData,
  onCancel,
  templates = [],
  onSaveAsTemplate,
  onDeleteTemplate
}: TaskFormProps) {
  // 表单字段状态
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.DAILY_LIFE);

  // 新的坐标系统状态
  const [urgency, setUrgency] = useState(50);      // 默认中间位置
  const [importance, setImportance] = useState(50);

  const [estimatedMinutes, setEstimatedMinutes] = useState<number | undefined>();

  // 模板相关状态
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');

  // 编辑模式下填充表单 - 改单时填上原内容
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setCategory(initialData.category);
      setEstimatedMinutes(initialData.estimatedMinutes);

      // 处理新旧数据兼容
      if (initialData.urgency !== undefined && initialData.importance !== undefined) {
        // 新数据：直接使用
        setUrgency(initialData.urgency);
        setImportance(initialData.importance);
      } else if (initialData.priority) {
        // 旧数据：迁移转换
        const coords = migratePriorityToCoordinates(initialData.priority);
        setUrgency(coords.urgency);
        setImportance(coords.importance);
      }
    }
  }, [initialData]);

  // 从模板加载数据
  const handleSelectTemplate = (template: TaskTemplate) => {
    setTitle(template.title);
    setDescription(template.description || '');
    setCategory(template.category);
    setUrgency(template.urgency);
    setImportance(template.importance);
    setEstimatedMinutes(template.estimatedMinutes);
  };

  // 保存为模板
  const handleSaveAsTemplate = () => {
    if (!templateName.trim() || !title.trim() || !onSaveAsTemplate) return;

    const input: CreateTaskInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      urgency,
      importance,
      estimatedMinutes,
    };

    onSaveAsTemplate(input, templateName.trim());
    setTemplateName('');
    setShowSaveTemplate(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      urgency,
      importance,
      estimatedMinutes,
    });

    // 新建模式下提交后重置表单
    if (!initialData) {
      setTitle('');
      setDescription('');
      setCategory(TaskCategory.DAILY_LIFE);
      setUrgency(50);
      setImportance(50);
      setEstimatedMinutes(undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 模板选择器 - 仅在非编辑模式且有模板时显示 */}
      {!initialData && templates.length > 0 && (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <TemplateSelector
            templates={templates}
            onSelectTemplate={handleSelectTemplate}
            onDeleteTemplate={onDeleteTemplate || (() => {})}
          />
        </div>
      )}

      {/* 任务标题 */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          任务标题 *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="输入任务标题..."
          required
        />
      </div>

      {/* 任务描述 */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          任务描述
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
          placeholder="添加任务描述..."
        />
      </div>

      {/* 任务分类 */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          任务分类 *
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as TaskCategory)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* 四象限优先级选择器 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          优先级（四象限法则）*
        </label>
        <QuadrantSelector
          urgency={urgency}
          importance={importance}
          onChange={({ urgency: u, importance: i }) => {
            setUrgency(u);
            setImportance(i);
          }}
        />
      </div>

      {/* 预计时长 */}
      <div>
        <label htmlFor="estimatedMinutes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          预计时长 (分钟)
        </label>
        <input
          type="number"
          id="estimatedMinutes"
          value={estimatedMinutes || ''}
          onChange={(e) => setEstimatedMinutes(e.target.value ? parseInt(e.target.value) : undefined)}
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="30"
        />
      </div>

      {/* 保存为模板 - 仅在非编辑模式显示 */}
      {!initialData && onSaveAsTemplate && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          {!showSaveTemplate ? (
            <button
              type="button"
              onClick={() => setShowSaveTemplate(true)}
              className="w-full py-2 px-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium"
            >
              💾 保存为模板
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="输入模板名称（如：刷LeetCode）"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                />
                <button
                  type="button"
                  onClick={handleSaveAsTemplate}
                  disabled={!templateName.trim() || !title.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  保存
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSaveTemplate(false);
                    setTemplateName('');
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  取消
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                保存当前任务配置为模板，下次可快速创建相同类型的任务
              </p>
            </div>
          )}
        </div>
      )}

      {/* 按钮组 */}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium"
        >
          {initialData ? '更新任务' : '创建任务'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            取消
          </button>
        )}
      </div>
    </form>
  );
}
