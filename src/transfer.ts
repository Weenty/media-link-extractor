import { PageData } from "./types";

export const saveToSessionStorage = (data: PageData): void => {
  try {
    sessionStorage.setItem(`pageData_${data.tabId}`, JSON.stringify(data));
    
    const urlKey = `pageData_${btoa(data.url)}`;
    sessionStorage.setItem(urlKey, JSON.stringify(data));
    
    sessionStorage.setItem('pageData_last', JSON.stringify(data));
  } catch (error) {
    console.error('Ошибка сохранения в sessionStorage:', error);
  }
};