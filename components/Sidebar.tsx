import React, { useState, useMemo } from 'react';
import type { ChatMessage } from '../types';
import { PlusIcon, BotIcon, TrashIcon, SearchIcon } from './Icons';

interface SidebarProps {
  chatSessions: Record<string, ChatMessage[]>;
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  isOpen: boolean;
}

const getSessionTitle = (messages: ChatMessage[]): string => {
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (firstUserMessage) {
    return firstUserMessage.text.length > 25 
      ? firstUserMessage.text.substring(0, 25) + '...' 
      : firstUserMessage.text;
  }
  return '새로운 대화';
};


const Sidebar: React.FC<SidebarProps> = ({ chatSessions, currentChatId, onNewChat, onSelectChat, onDeleteChat, isOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const chatIds = Object.keys(chatSessions).reverse();

  const filteredChatIds = useMemo(() => {
    if (!searchTerm.trim()) {
      return chatIds;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return chatIds.filter(id => {
      const sessionMessages = chatSessions[id];
      if (!sessionMessages) return false;
      return sessionMessages.some(message =>
        message.text.toLowerCase().includes(lowercasedSearchTerm)
      );
    });
  }, [searchTerm, chatIds, chatSessions]);

  return (
    <aside 
      className={`absolute z-20 top-0 left-0 h-full bg-stone-950 flex flex-col w-72 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:h-auto md:my-4 md:ml-4 md:rounded-lg ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      aria-label="Chat history"
    >
        <div className="p-3">
            <button
                onClick={onNewChat}
                className="w-full flex items-center justify-center gap-2 p-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-stone-900 transition-colors duration-200"
            >
                <PlusIcon className="w-6 h-6" />
                <span>새로운 대화 시작</span>
            </button>
        </div>
        <div className="px-3 pb-2">
            <div className="relative">
                <input
                    type="text"
                    placeholder="대화 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-stone-800 text-stone-300 placeholder-stone-500 border border-stone-700 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="w-5 h-5 text-stone-500" />
                </div>
            </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
            <h2 className="px-2 text-xs font-semibold text-stone-500 uppercase tracking-wider">대화 목록</h2>
            {chatIds.length > 0 ? (
                <ul>
                    {filteredChatIds.length > 0 ? (
                        filteredChatIds.map(id => (
                        <li key={id} className="relative group">
                                <button
                                    onClick={() => onSelectChat(id)}
                                    className={`w-full text-left p-3 pr-10 rounded-md transition-colors text-sm flex items-start gap-3 ${currentChatId === id ? 'bg-stone-700 text-stone-100' : 'text-stone-300 hover:bg-stone-800'}`}
                                >
                                    <BotIcon className="w-5 h-5 mt-0.5 flex-shrink-0 text-stone-400" />
                                    <span className="flex-1 break-all">{getSessionTitle(chatSessions[id])}</span>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteChat(id);
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-stone-500 hover:text-red-500 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                                    aria-label="Delete chat"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                        </li>
                        ))
                    ) : (
                        <p className="px-2 text-sm text-stone-500">검색 결과가 없습니다.</p>
                    )}
                </ul>
            ) : (
                <p className="px-2 text-sm text-stone-500">아직 대화가 없습니다.</p>
            )}
        </nav>
    </aside>
  );
};

export default Sidebar;