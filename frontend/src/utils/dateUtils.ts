/**
 * 日期工具函数
 */

/**
 * 获取某一天所在周的开始日期（周一）
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 周日算上一周
  return new Date(d.setDate(diff));
}

/**
 * 获取某一天所在周的结束日期（周日）
 */
export function getWeekEnd(date: Date): Date {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end;
}

/**
 * 格式化周范围显示
 * @example "2024年1月1日 - 1月7日"
 */
export function formatWeekRange(date: Date): string {
  const start = getWeekStart(date);
  const end = getWeekEnd(date);

  const startMonth = start.getMonth() + 1;
  const startDay = start.getDate();
  const endMonth = end.getMonth() + 1;
  const endDay = end.getDate();
  const year = start.getFullYear();

  if (startMonth === endMonth) {
    return `${year}年${startMonth}月${startDay}日 - ${endDay}日`;
  } else {
    return `${year}年${startMonth}月${startDay}日 - ${endMonth}月${endDay}日`;
  }
}

/**
 * 获取周数（一年中的第几周）
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * 检查日期是否在某周内
 */
export function isInWeek(date: Date, weekDate: Date): boolean {
  const start = getWeekStart(weekDate);
  const end = getWeekEnd(weekDate);

  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return d >= start && d <= end;
}

/**
 * 获取本周的所有日期
 */
export function getWeekDates(weekDate: Date): Date[] {
  const start = getWeekStart(weekDate);
  const dates: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date);
  }

  return dates;
}

/**
 * 格式化日期为简短格式
 * @example "1/1 周一"
 */
export function formatShortDate(date: Date): string {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = weekdays[date.getDay()];

  return `${month}/${day} ${weekday}`;
}

/**
 * 检查是否是今天
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}
