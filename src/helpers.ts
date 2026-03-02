export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number = 100
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const getTabId = (): string => {
  let id = sessionStorage.getItem('react_extension_tabId');
  if (!id) {
    id = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('react_extension_tabId', id);
  }
  return id;
};