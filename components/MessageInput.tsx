import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './Icons';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      onSendMessage(trimmedMessage);
      setMessage('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);
  
  useEffect(() => {
    if (!isLoading && textareaRef.current) {
        textareaRef.current.focus();
    }
  }, [isLoading]);


  return (
    <div className="flex items-end p-4 bg-stone-100/80 dark:bg-stone-900/80 backdrop-blur-sm border-t border-stone-200 dark:border-stone-700">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="가정교회에 대해 질문해보세요..."
        className="flex-1 p-3 bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-shadow duration-200"
        rows={1}
        disabled={isLoading}
        style={{maxHeight: '150px'}}
      />
      <button
        onClick={handleSendMessage}
        disabled={isLoading || !message.trim()}
        className="ml-3 p-3 bg-orange-500 text-white rounded-full disabled:bg-stone-400 dark:disabled:bg-stone-600 disabled:cursor-not-allowed hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-offset-stone-900 transition-colors duration-200"
        aria-label="Send message"
      >
        <SendIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default MessageInput;