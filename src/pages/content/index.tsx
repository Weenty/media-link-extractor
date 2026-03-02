import { getTabId, throttle } from "@src/helpers";
import { saveToSessionStorage } from "@src/transfer";
import { PageData } from "@src/types";

const collectPageData = (tabId: string): PageData => {
  const images: Set<string> = new Set();
  const videos: Set<string> = new Set();

  document.querySelectorAll('img, video, source').forEach(el => {
    if (el.hasAttribute('src') || el.hasAttribute('srcset')) {
      const src = el.getAttribute('src') || el.getAttribute('srcset');
      if (src) {
        if (el.tagName === 'VIDEO' || el.tagName === 'SOURCE' && el.closest('video')) {
          videos.add(src);
        } else if (el.tagName === 'IMG' || el.tagName === 'SOURCE' && el.closest('picture')) {
          images.add(src);
        }
      }
    }
    
    if (el.hasAttribute('srcset')) {
      const srcset = el.getAttribute('srcset');
      if (srcset) {
        srcset.split(',').forEach(entry => {
          const url = entry.trim().split(' ')[0];
          if (url) images.add(url);
        });
      }
    }
    
    if (el.tagName === 'VIDEO' && el.hasAttribute('poster')) {
      const poster = el.getAttribute('poster');
      if (poster) images.add(poster);
    }
  });

  document.querySelectorAll('[style*="background"]').forEach(el => {
    const style = el.getAttribute('style');
    if (style) {
      const bgMatch = style.match(/background(?:-image)?:\s*url\(['"]?([^'"()]+)['"]?\)/i);
      if (bgMatch && bgMatch[1]) {
        images.add(bgMatch[1]);
      }
    }
  });

  return {
    tabId,
    url: window.location.href,
    images: Array.from(images),
    videos: Array.from(videos)
  }
};

const initContentScript = (): void => {
  const tabId = getTabId();

  const initialData = collectPageData(tabId);
  saveToSessionStorage(initialData);

  const handleScroll = throttle(() => {
    const data = collectPageData(tabId);
    saveToSessionStorage(data);
  }, 200);

  window.addEventListener('scroll', handleScroll);
  window.addEventListener('click', handleScroll);

  const handleSelectionChange = () => {
    const data = collectPageData(tabId);
    saveToSessionStorage(data);
  };

  document.addEventListener('selectionchange', handleSelectionChange);

  window.addEventListener('beforeunload', () => {
    const data = collectPageData(tabId);
    saveToSessionStorage(data);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContentScript);
} else {
  initContentScript();
}