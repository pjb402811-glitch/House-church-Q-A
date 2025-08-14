import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { BotIcon, UserIcon } from './Icons';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollRef} className="relative flex-1 overflow-y-auto bg-stone-50 dark:bg-stone-800">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
          <div className="text-center">
              <p className="text-4xl lg:text-5xl font-black text-stone-900/5 dark:text-stone-100/5 tracking-wider leading-tight">
                  영혼구원하여<br/>제자삼는 가정교회
              </p>
              <p className="mt-2 text-xl font-medium text-stone-900/10 dark:text-stone-100/10 tracking-wide">
                (made by 대전 성은감리교회)
              </p>
          </div>
      </div>
      <div className="relative p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && (
              <div className="w-9 h-9 flex-shrink-0 bg-orange-500 rounded-full flex items-center justify-center text-white shadow">
                  <BotIcon className="w-5 h-5" />
              </div>
            )}
            <div
              className={`max-w-xl p-4 rounded-2xl shadow-sm ${
                msg.role === 'user'
                  ? 'bg-orange-500 text-white rounded-br-none'
                  : 'bg-stone-900 text-stone-100 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
            {msg.role === 'user' && (
              <div className="w-9 h-9 flex-shrink-0 bg-stone-300 dark:bg-stone-600 rounded-full flex items-center justify-center text-stone-600 dark:text-stone-300 shadow">
                  <UserIcon className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
              <div className="w-9 h-9 flex-shrink-0 bg-orange-500 rounded-full flex items-center justify-center text-white shadow">
                  <BotIcon className="w-5 h-5" />
              </div>
            <div className="max-w-xl p-4 rounded-2xl shadow-sm bg-stone-900 rounded-bl-none">
              <div className="flex items-center space-x-1.5">
                  <span className="text-stone-300">답변을 생각 중입니다</span>
                  <div className="w-2 h-2 bg-stone-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-stone-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-stone-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;