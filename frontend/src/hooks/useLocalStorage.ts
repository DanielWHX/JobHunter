import { useState, useEffect } from 'react';

/**
 * 自定义 Hook: 使用 LocalStorage 持久化状态
 * @param key - LocalStorage 的键名
 * @param initialValue - 初始值
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 从 LocalStorage 读取初始值
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      // 解析 JSON 并转换日期字符串为 Date 对象
      const parsed = JSON.parse(item, (key, value) => {
        // 检测 ISO 8601 日期格式
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          return new Date(value);
        }
        return value;
      });

      return parsed;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 每次状态更新时，同步到 LocalStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
