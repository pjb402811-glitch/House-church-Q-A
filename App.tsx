import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { ChatMessage } from './types';
import { GeminiService } from './services/geminiService';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import { BotIcon, KeyIcon, MenuIcon } from './components/Icons';
import ApiKeySetup from './components/ApiKeySetup';
import Sidebar from './components/Sidebar';
import ConfirmationDialog from './components/ConfirmationDialog';

const API_KEY_STORAGE_KEY = 'gemini-api-key';
const CHAT_SESSIONS_STORAGE_KEY = 'gemini-chat-sessions';

const INITIAL_GREETING_MESSAGE: ChatMessage = {
    id: 'initial-greeting',
    role: 'model',
    text: '안녕하십니까. 가정교회에 대해 무엇이든 물어보십시오. 영혼을 구원하여 제자 삼는 성경적인 교회에 대한 비전을 나누길 원합니다.'
};

const App: React.FC = () => {
  const [chatSessions, setChatSessions] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const savedSessions = localStorage.getItem(CHAT_SESSIONS_STORAGE_KEY);
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
            return parsed;
        }
      }
    } catch (error) {
      console.error("Failed to load or parse chat sessions:", error);
      localStorage.removeItem(CHAT_SESSIONS_STORAGE_KEY);
    }
    return {};
  });
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem(API_KEY_STORAGE_KEY));
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  const geminiServiceRef = useRef<GeminiService | null>(null);

  useEffect(() => {
    if (Object.keys(chatSessions).length > 0) {
        localStorage.setItem(CHAT_SESSIONS_STORAGE_KEY, JSON.stringify(chatSessions));
    } else {
        localStorage.removeItem(CHAT_SESSIONS_STORAGE_KEY);
    }
  }, [chatSessions]);
  
  const handleInvalidApiKey = useCallback(() => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey(null);
    setError("API Key가 유효하지 않습니다. 확인 후 다시 입력해주세요.");
    setShowSettings(true);
  }, []);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!geminiServiceRef.current) {
        setError("API Key가 설정되지 않았습니다. 먼저 Key를 설정해주세요.");
        setPendingMessage(messageText);
        setShowSettings(true);
        return;
    }

    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: messageText
    };
    
    let chatToUpdateId = currentChatId;

    if (!chatToUpdateId) {
        const newId = Date.now().toString();
        setChatSessions(prev => ({ ...prev, [newId]: [INITIAL_GREETING_MESSAGE, userMessage] }));
        setCurrentChatId(newId);
        chatToUpdateId = newId;
    } else {
        setChatSessions(prev => ({ ...prev, [chatToUpdateId!]: [...(prev[chatToUpdateId!] || []), userMessage] }));
    }

    try {
        const botResponseText = await geminiServiceRef.current.sendMessage(messageText);
        const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: botResponseText
        };
        setChatSessions(prev => ({
            ...prev,
            [chatToUpdateId!]: [...(prev[chatToUpdateId!] || []), botMessage]
        }));
    } catch (e: any) {
        console.error("Message sending error:", e);
        if (e.message?.includes('API key not valid') || (e.message?.includes('400') && e.message?.toLowerCase().includes('api key'))) {
            handleInvalidApiKey();
        } else {
            const botMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: "죄송합니다. 답변을 생성하는 중에 오류가 발생했습니다. 네트워크 연결을 확인하거나 잠시 후 다시 시도해 주십시오."
            };
            setChatSessions(prev => ({
                ...prev,
                [chatToUpdateId!]: [...(prev[chatToUpdateId!] || []), botMessage]
            }));
        }
    } finally {
        setIsLoading(false);
    }
  }, [currentChatId, handleInvalidApiKey]);

  useEffect(() => {
    if (apiKey) {
      try {
        geminiServiceRef.current = new GeminiService(apiKey);
        setError(null);
        if (showSettings) {
          setShowSettings(false);
        }
      } catch (e) {
        console.error(e);
        setError("API Key를 초기화하는 데 실패했습니다. 올바른 Key인지 확인해주세요.");
        setApiKey(null);
        localStorage.removeItem(API_KEY_STORAGE_KEY);
        geminiServiceRef.current = null;
      }
    } else {
        geminiServiceRef.current = null;
    }
  }, [apiKey]);

  useEffect(() => {
      if (!apiKey) {
          setShowSettings(true);
      }
  }, [apiKey]);


  useEffect(() => {
    if (pendingMessage && !showSettings && geminiServiceRef.current) {
        handleSendMessage(pendingMessage);
        setPendingMessage(null);
    }
  }, [pendingMessage, showSettings, handleSendMessage]);


  const handleSaveApiKey = useCallback((newApiKey: string) => {
    localStorage.setItem(API_KEY_STORAGE_KEY, newApiKey);
    setApiKey(newApiKey);
  }, []);

  const handleClearApiKey = useCallback(() => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    localStorage.removeItem(CHAT_SESSIONS_STORAGE_KEY);
    setApiKey(null);
    setChatSessions({});
    setCurrentChatId(null);
    setError("API Key가 삭제되었습니다. 새로 입력해주세요.");
    setShowSettings(true);
  }, []);
  
  const handleCloseSettings = useCallback(() => {
    setError(null);
    setPendingMessage(null);
    setShowSettings(false);
  }, []);
  
  const handleNewChat = useCallback(() => {
    const newId = Date.now().toString();
    setChatSessions(prev => ({
        ...prev,
        [newId]: [INITIAL_GREETING_MESSAGE]
    }));
    setCurrentChatId(newId);
    setSidebarOpen(false);
  }, []);

  const handleSelectChat = useCallback((id: string) => {
    setCurrentChatId(id);
    setSidebarOpen(false);
  }, []);

  const handleRequestDelete = useCallback((id: string) => {
    setChatToDelete(id);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!chatToDelete) return;

    setChatSessions(prev => {
        const newSessions = { ...prev };
        delete newSessions[chatToDelete];
        return newSessions;
    });

    if (currentChatId === chatToDelete) {
        setCurrentChatId(null);
    }
    setChatToDelete(null);
  }, [chatToDelete, currentChatId]);

  const handleCancelDelete = useCallback(() => {
    setChatToDelete(null);
  }, []);

  const messages = currentChatId ? chatSessions[currentChatId] || [] : [];

  return (
    <div className="relative flex w-full h-full max-w-7xl mx-auto">
        <Sidebar 
            chatSessions={chatSessions}
            currentChatId={currentChatId}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleRequestDelete}
            isOpen={isSidebarOpen}
        />
        {isSidebarOpen && <div onClick={() => setSidebarOpen(false)} className="absolute inset-0 z-10 bg-black/50 md:hidden" aria-hidden="true"></div>}

        <main className="flex flex-col flex-1 bg-stone-800 shadow-xl sm:my-4 sm:mr-4 sm:rounded-lg overflow-hidden">
            <header className="flex items-center justify-between p-4 border-b border-stone-700 bg-stone-900/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center">
                     <button 
                        onClick={() => setSidebarOpen(!isSidebarOpen)} 
                        className="mr-3 p-2 text-stone-400 hover:bg-stone-700 rounded-full transition-colors md:hidden"
                        aria-label="Toggle menu"
                    >
                        <MenuIcon className="w-6 h-6" />
                    </button>
                    <div className="flex items-center">
                         <div className="w-12 h-12 flex-shrink-0 bg-orange-500 rounded-full flex items-center justify-center text-white mr-4 shadow-lg shadow-orange-500/30">
                            <BotIcon className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">영혼을 구원하여 제자삼는 가정교회 챗봇</h1>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => {
                        setError(null);
                        setShowSettings(true)
                    }} 
                    className="flex items-center gap-2 px-3 py-2 text-stone-300 hover:bg-stone-700 hover:text-stone-100 rounded-lg transition-colors text-sm font-semibold"
                    aria-label="설정"
                >
                    <KeyIcon className="w-5 h-5" />
                    <span>설정</span>
                </button>
            </header>
            <ChatWindow messages={messages} isLoading={isLoading} />
            <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </main>

        {showSettings && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <ApiKeySetup 
                    onSaveApiKey={handleSaveApiKey} 
                    onClearApiKey={apiKey ? handleClearApiKey : undefined}
                    currentApiKey={apiKey}
                    onClose={handleCloseSettings}
                />
            </div>
        )}

        <ConfirmationDialog
            isOpen={!!chatToDelete}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            title="대화 삭제"
            message="이 대화 기록을 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        />
    </div>
  );
};

export default App;
