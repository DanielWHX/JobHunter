import { useState, useEffect } from 'react';

/**
 * 使用 LocalStorage 持久化状态的自定义 Hook
 * @param key LocalStorage 键名
 * @param initialValue 初始值
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 初始化状态：从 LocalStorage 读取或使用默认值
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      // 解析 JSON，将日期字符串转换为 Date 对象
      const parsed = JSON.parse(item, (key, value) => {
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

  // 状态更新时同步到 LocalStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
