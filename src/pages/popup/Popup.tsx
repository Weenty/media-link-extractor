import { useState } from 'react';
import usePageData from './usePageData';
import CopyAllButton from './CopyAllButton';

export default function Popup() {
  const { data, loading, error } = usePageData();
  const [activeTab, setActiveTab] = useState('images');

  const tabs = [
    { id: 'images', label: 'Изображения', count: data?.images?.length || 0 },
    { id: 'videos', label: 'Видео', count: data?.videos?.length || 0 }
  ];

  const copyData = () => {
    if (activeTab === 'images' && data?.images) {
      navigator.clipboard.writeText(data?.images.join('\n'))
    }

    if (activeTab === 'videos' && data?.videos) {
      navigator.clipboard.writeText(data?.videos.join('\n'))
    }
  }

  if (loading) {
    return (
      <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800 flex items-center justify-center">
        <div className="text-white">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800 flex items-center justify-center">
        <div className="text-white">Нет данных</div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800">
      <div className="flex justify-center space-x-2 mb-6 bg-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-6 py-3 rounded-lg font-medium transition-all duration-200
              flex items-center space-x-2
              ${activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }
            `}
          >
            <span>{tab.label}</span>
            <span className={`
              px-2 py-1 rounded-full text-xs
              ${activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-600 text-gray-300'
              }
            `}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        {activeTab === 'images' && (
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-white text-xl mb-4 font-medium flex justify-between items-center">
              Список изображений
              <CopyAllButton onClick={copyData} disabled={data[activeTab].length == 0} />
            </h3>
            <div className="space-y-2">
              {data.images.map((url) => (
                <div
                  className="bg-gray-800 rounded-lg p-3 text-left hover:bg-gray-750 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-300 font-mono text-sm break-all">
                      {url}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-white text-xl mb-4 font-medium flex justify-between items-center">
              Список видео
              <CopyAllButton onClick={copyData} disabled={data[activeTab].length == 0} />
            </h3>
            <div className="space-y-2">
              {data.videos.map((url, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg p-3 text-left hover:bg-gray-750 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-300 font-mono text-sm break-all">
                      {url}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}