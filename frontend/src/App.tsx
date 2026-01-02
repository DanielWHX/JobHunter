import { useState } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { Task, CreateTaskInput, TaskStatus } from './types/task';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  // 使用 LocalStorage 持久化任务数据
  const [tasks, setTasks] = useLocalStorage<Task[]>('jobhunter-tasks', []);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            每日任务管理
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            今天是 {new Date().toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 任务表单 */}
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
              />
            </div>
          </div>

          {/* 任务列表 */}
          <div className="lg:col-span-2">
            <TaskList
              tasks={tasks}
              onToggleStatus={handleToggleStatus}
              onEdit={setEditingTask}
              onDelete={handleDeleteTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
