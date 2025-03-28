'use client';

import { SendIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState, useRef } from 'react';
import { Header } from '@/components/Header';

interface Message {
  user: string;
  text: string;
  action: string;
  role: 'user' | 'assistant'; // Added role for UI rendering
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      setLoading(true);
      e.preventDefault();
      if (!input.trim()) return;

      // Add user message
      const userMessage: Message = {
        user: 'User',
        text: input.trim(),
        action: '',
        role: 'user',
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');

      const res = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input.trim() }),
      });

      const result: Message[] = await res.json();
      setMessages((prev) => [...prev, ...result]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className='flex flex-col h-[calc(100vh-64px)]'>
        {/* Adjust height based on your header */}
        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user' ? 'bg-blue-600 text-white' : 'prose bg-neutral-200'}`}>
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && (
            <div className='flex justify-start'>
              <div className='max-w-[80%] rounded-lg p-3 bg-neutral-800 text-white'>
                <div className='flex space-x-1'>
                  <div className='w-1 h-1 bg-white rounded-full animate-bounce'></div>
                  <div className='w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.2s]'></div>
                  <div className='w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.4s]'></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className='p-4 border-t border-neutral-800'>
          <div className='flex gap-2'>
            <input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className='flex-1 bg-neutral-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Type your message...'
            />
            <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'>
              <SendIcon />
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default Chat;
