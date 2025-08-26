import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { BotIcon, UserIcon } from './Icons';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

const SuggestedQuestions: React.FC<{ onSendMessage: (message: string) => void }> = ({ onSendMessage }) => {
    const questions = [
        '가정교회는 무엇인가요?',
        '목자/목녀의 역할은 무엇인가요?',
        '가정교회는 왜 신약교회 회복을 강조하나요?',
        'VIP는 누구를 의미하나요?',
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {questions.map((q, i) => (
                <button
                    key={i}
                    onClick={() => onSendMessage(q)}
                    className="p-4 bg-stone-700/50 hover:bg-stone-700 text-stone-200 rounded-lg text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                    <p className="font-semibold">{q}</p>
                </button>
            ))}
        </div>
    );
};


const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSendMessage }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const showSuggestedQuestions = messages.length === 1 && messages[0].id === 'initial-greeting';

  return (
    <div className="relative flex-1 flex flex-col min-h-0 overflow-hidden bg-stone-800">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
          <div className="text-center">
              <p className="text-4xl lg:text-5xl font-black text-stone-100/10 tracking-wider leading-tight">
                  영혼을 구원하여<br/>제자삼는 가정교회
              </p>
              <p className="mt-2 text-xl font-medium text-stone-100/20 tracking-wide">
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
                className={`max-w-xl p-4 rounded-2xl shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-orange-500 text-white rounded-br-none'
                    : 'bg-stone-700 text-stone-100 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
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

      {showSuggestedQuestions && !isLoading && (
        <div className="p-4 border-t border-stone-700/50">
          <SuggestedQuestions onSendMessage={onSendMessage} />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;