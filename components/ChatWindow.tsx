import React, { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '../types';
import { BotIcon, UserIcon, CopyIcon, CheckIcon } from './Icons';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleCopy = (text: string, id: string) => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedMessageId(id);
            setTimeout(() => setCopiedMessageId(null), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
  };

  return (
    <div className="relative flex-1 flex flex-col min-h-0 overflow-hidden bg-stone-800">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
          <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-black text-stone-100/10 tracking-wider leading-tight">
                영혼을 구원하여 제자삼는 가정교회
              </h1>
              <p className="text-xl lg:text-3xl font-black text-stone-100/10 tracking-wider mt-1">
                (Made by 성은감리교회)
              </p>
          </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="relative p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && (
                <div className="w-9 h-9 flex-shrink-0 bg-orange-500 rounded-full flex items-center justify-center text-white shadow">
                    <BotIcon className="w-5 h-5" />
                </div>
              )}
              <div
                className={`max-w-xl p-4 rounded-2xl shadow-sm relative group ${
                  msg.role === 'user'
                    ? 'bg-orange-500 text-white rounded-br-none'
                    : 'bg-stone-700 text-stone-100 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                {msg.role === 'model' && (
                    <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="absolute top-2 right-2 p-1.5 text-stone-400 bg-stone-800/50 hover:bg-stone-800/80 hover:text-stone-100 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200"
                        aria-label="Copy message text"
                    >
                        {copiedMessageId === msg.id ? (
                            <CheckIcon className="w-4 h-4 text-green-400" />
                        ) : (
                            <CopyIcon className="w-4 h-4" />
                        )}
                    </button>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-9 h-9 flex-shrink-0 bg-stone-600 rounded-full flex items-center justify-center text-stone-300 shadow">
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
              <div className="max-w-xl p-4 rounded-2xl shadow-sm bg-stone-700 rounded-bl-none">
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
    </div>
  );
};

export default ChatWindow;