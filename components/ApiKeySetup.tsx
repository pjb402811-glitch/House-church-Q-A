import React, { useState } from 'react';
import { XIcon } from './Icons';

interface ApiKeySetupProps {
  onSaveApiKey: (key: string) => void;
  onClose: () => void;
  onClearApiKey?: () => void;
  currentApiKey?: string | null;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onSaveApiKey, onClose, onClearApiKey, currentApiKey }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    if (apiKey.trim()) {
      onSaveApiKey(apiKey.trim());
    }
  };

  return (
    <div className="relative w-full max-w-md bg-stone-50 dark:bg-stone-800 p-8 rounded-xl shadow-2xl">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-2 text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full transition-colors"
        aria-label="Close settings"
      >
        <XIcon className="w-6 h-6" />
      </button>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
          Google AI API Key 설정
        </h1>
        <p className="text-xl font-semibold text-red-600 dark:text-red-500 mb-6">
          가정교회 챗봇을 사용하려면 Google AI API Key를 아래에 입력해주세요
        </p>
      </div>
      
      {currentApiKey && (
           <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
              <span className="block sm:inline">API 키가 저장되어 있습니다.</span>
          </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
            Google AI API Key 입력
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full p-3 bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
          />
        </div>
        <div className="text-xs text-stone-500 dark:text-stone-400 space-y-3">
          <p className="text-stone-600 dark:text-stone-400">API 키는 브라우저에만 저장되며, 외부로 전송되지 않습니다. 키가 없으시다면 아래 안내에 따라 발급받으세요.</p>
          <div className="border border-stone-200 dark:border-stone-700 p-4 rounded-lg bg-stone-100 dark:bg-stone-900/50">
              <p className="font-medium text-base text-stone-800 dark:text-stone-200 mb-3">Google AI API Key 발급방법</p>
              <ol className="list-decimal list-inside space-y-2 text-stone-600 dark:text-stone-400">
                  <li>
                      <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300 underline">
                          Google AI Studio
                      </a>
                      <span className="text-stone-600 dark:text-stone-400"> 페이지로 이동하여 로그인합니다.</span>
                  </li>
                  <li>'Get API Key' 버튼을 클릭합니다.</li>
                  <li>생성된 API 키를 복사합니다.</li>
                  <li>복사한 키를 위 입력창에 붙여넣고 '키 저장' 버튼을 누릅니다.</li>
              </ol>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        {currentApiKey && onClearApiKey && (
           <button
              onClick={onClearApiKey}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-stone-800 transition-colors"
            >
            기존 키 삭제
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={!apiKey.trim()}
          className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg font-semibold disabled:bg-stone-400 dark:disabled:bg-stone-600 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-offset-stone-800 transition-colors"
        >
          {currentApiKey ? '키 변경 및 저장' : '키 저장'}
        </button>
      </div>
    </div>
  );
};

export default ApiKeySetup;