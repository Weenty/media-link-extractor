import { PageData } from "@src/types";
import { useCallback, useEffect, useState } from "react";

const usePageData = () => {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadFromSessionStorage = useCallback(async (): Promise<void> => {
    try {
      const [tab] = await chrome.tabs.query({ 
        active: true, 
        currentWindow: true 
      });
      
      if (!tab?.id) {
        setError('Не удалось получить текущую вкладку');
        setLoading(false);
        return;
      }

      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (): PageData | null => {
          try {
            const urlKey = `pageData_${btoa(window.location.href)}`;
            const saved = sessionStorage.getItem(urlKey);
            
            if (saved) {
              return JSON.parse(saved);
            }
            
            const lastData = sessionStorage.getItem('pageData_last');
            if (lastData) {
              return JSON.parse(lastData);
            }
            
            return null;
          } catch (e) {
            console.error('Ошибка чтения sessionStorage:', e);
            return null;
          }
        }
      });

      if (results?.[0]?.result) {
        setData(results[0].result);
        setError(null);
      }
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadFromSessionStorage();

    const interval = setInterval(loadFromSessionStorage, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [loadFromSessionStorage]);

  return { data, loading, error, refresh: loadFromSessionStorage };
};

export default usePageData