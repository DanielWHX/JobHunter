import { formatWeekRange, getWeekNumber } from '../utils/dateUtils';

interface WeekNavigatorProps {
  currentWeek: Date;
  onWeekChange: (date: Date) => void;
}

export default function WeekNavigator({ currentWeek, onWeekChange }: WeekNavigatorProps) {
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    onWeekChange(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    onWeekChange(newDate);
  };

  const goToToday = () => {
    onWeekChange(new Date());
  };

  const weekNumber = getWeekNumber(currentWeek);
  const isCurrentWeek = () => {
    const today = new Date();
    const todayWeek = getWeekNumber(today);
    const todayYear = today.getFullYear();
    const currentYear = currentWeek.getFullYear();
    return weekNumber === todayWeek && currentYear === todayYear;
  };

  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <button
        onClick={goToPreviousWeek}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="上一周"
      >
        <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex flex-col items-center">
        <div className="text-lg font-semibold text-gray-800 dark:text-white">
          {formatWeekRange(currentWeek)}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          第 {weekNumber} 周
          {isCurrentWeek() && (
            <span className="ml-2 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full text-xs font-medium">
              本周
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {!isCurrentWeek() && (
          <button
            onClick={goToToday}
            className="px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
          >
            回到本周
          </button>
        )}
        <button
          onClick={goToNextWeek}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="下一周"
        >
          <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
