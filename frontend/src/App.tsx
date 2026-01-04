import { useState } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import WeekNavigator from './components/WeekNavigator';
import MatrixView from './components/MatrixView';
import { Task, CreateTaskInput, TaskStatus, TaskTemplate } from './types/task';
import { useLocalStorage } from './hooks/useLocalStorage';
import { isInWeek } from './utils/dateUtils';

type ViewMode = 'list' | 'matrix';

function App() {
  // 使用 LocalStorage 持久化任务数据
  const [tasks, setTasks] = useLocalStorage<Task[]>('jobhunter-tasks', []);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // 使用 LocalStorage 持久化模板数据
  const [templates, setTemplates] = useLocalStorage<TaskTemplate[]>('jobhunter-templates', []);

  // 当前查看的周
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // 视图模式：列表视图 or 矩阵视图
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // 创建任务
  const handleCreateTask = (input: CreateTaskInput) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...input,
      status: TaskStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks([...tasks, newTask]);
  };

  // 更新任务
  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
    setEditingTask(null);
  };

  // 删除任务
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // 切换任务完成状态
  const handleToggleStatus = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newStatus = task.status === TaskStatus.COMPLETED
          ? TaskStatus.PENDING
          : TaskStatus.COMPLETED;
        return {
          ...task,
          status: newStatus,
          completedAt: newStatus === TaskStatus.COMPLETED ? new Date() : undefined,
          updatedAt: new Date()
        };
      }
      return task;
    }));
  };

  // 保存为模板
  const handleSaveAsTemplate = (input: CreateTaskInput, name: string) => {
    const newTemplate: TaskTemplate = {
      id: Date.now().toString(),
      name,
      title: input.title,
      description: input.description,
      category: input.category,
      urgency: input.urgency,
      importance: input.importance,
      estimatedMinutes: input.estimatedMinutes,
      tags: input.tags,
      createdAt: new Date(),
      usageCount: 0
    };
    setTemplates([...templates, newTemplate]);
  };

  // 删除模板
  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
  };

  // 过滤本周的任务
  const weekTasks = tasks.filter(task => {
    // 如果任务没有截止日期，显示在当前周
    if (!task.dueDate) return true;
    // 如果有截止日期，检查是否在当前周内
    return isInWeek(new Date(task.dueDate), currentWeek);
  });

  // 渲染应用界面
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            每周任务管理
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            基于四象限法则的任务优先级管理系统
          </p>
        </header>

        {/* 周导航器 */}
        <WeekNavigator currentWeek={currentWeek} onWeekChange={setCurrentWeek} />

        {/* 视图切换按钮 */}
        <div className="flex justify-end mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 flex gap-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                列表视图
              </div>
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'matrix'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                矩阵视图
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：任务表单 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                {editingTask ? '编辑任务' : '新建任务'}
              </h2>
              <TaskForm
                onSubmit={editingTask
                  ? (input) => handleUpdateTask(editingTask.id, input)
                  : handleCreateTask
                }
                initialData={editingTask || undefined}
                onCancel={editingTask ? () => setEditingTask(null) : undefined}
                templates={templates}
                onSaveAsTemplate={handleSaveAsTemplate}
                onDeleteTemplate={handleDeleteTemplate}
              />
            </div>
          </div>

          {/* 右侧：根据视图模式显示不同内容 */}
          <div className="lg:col-span-2">
            {viewMode === 'list' ? (
              <TaskList
                tasks={weekTasks}
                onToggleStatus={handleToggleStatus}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
              />
            ) : (
              <MatrixView
                tasks={weekTasks}
                onTaskClick={setEditingTask}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
