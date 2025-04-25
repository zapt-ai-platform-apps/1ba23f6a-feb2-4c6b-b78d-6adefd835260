import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/modules/auth/AuthProvider';
import * as Sentry from '@sentry/browser';
import io from 'socket.io-client';

export default function ChatPage() {
  const { user, getToken } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  // Initialize socket connection
  useEffect(() => {
    const initSocket = async () => {
      try {
        setIsLoading(true);
        
        // Initialize the socket endpoint
        await fetch('/api/socket');
        
        const token = getToken();
        if (!token) {
          throw new Error('Authentication token missing');
        }
        
        // Connect to the socket server
        socketRef.current = io({
          path: '/api/socket',
          auth: {
            token
          }
        });
        
        // Socket event handlers
        socketRef.current.on('connect', () => {
          console.log('Socket connected');
          setIsConnected(true);
          socketRef.current.emit('load_messages');
        });
        
        socketRef.current.on('message', (data) => {
          setMessages(prev => [...prev, data]);
        });
        
        socketRef.current.on('message_history', (data) => {
          setMessages(data);
        });
        
        socketRef.current.on('error', (data) => {
          console.error('Socket error:', data);
          setError(data.message || 'Error with chat connection');
        });
        
        socketRef.current.on('disconnect', () => {
          console.log('Socket disconnected');
          setIsConnected(false);
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Socket initialization error:', err);
        Sentry.captureException(err);
        setError('Failed to connect to chat server');
        setIsLoading(false);
      }
    };
    
    initSocket();
    
    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [getToken]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim() || !isConnected) return;
    
    socketRef.current.emit('send_message', { content: message });
    setMessage('');
  };
  
  return (
    <div>
      <h1 className="text-2xl font-orbitron font-bold mb-6">Chat Tim</h1>
      
      <div className="frost-card overflow-hidden h-[70vh] flex flex-col">
        {/* Chat header */}
        <div className="bg-frost-800 text-white p-4 flex items-center justify-between">
          <div className="font-orbitron">Frost Warlord Team Chat</div>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
        </div>
        
        {/* Chat messages */}
        <div className="flex-grow p-4 overflow-y-auto bg-frost-50">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="frost-loading frost-loading-lg"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full text-red-600">
              {error}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full text-warlord-500">
              Belum ada pesan. Mulai percakapan sekarang!
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender?.id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                      msg.sender?.id === user?.id
                        ? 'bg-frost-600 text-white'
                        : msg.id === 'system'
                          ? 'bg-warlord-200 text-warlord-800 text-center mx-auto'
                          : 'bg-white border border-frost-200'
                    }`}
                  >
                    {msg.id !== 'system' && msg.sender?.id !== user?.id && (
                      <div className="font-bold text-frost-800 text-sm mb-1">
                        {msg.sender?.name || 'Unknown User'}
                      </div>
                    )}
                    <div>{msg.content}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString('id-ID', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Chat input */}
        <div className="p-3 border-t border-frost-100 bg-white">
          <form onSubmit={handleSendMessage} className="flex">
            <input
              type="text"
              className="frost-input flex-grow"
              placeholder="Tulis pesan..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!isConnected || isLoading}
            />
            <button
              type="submit"
              className="ml-2 bg-frost-600 text-white p-2 rounded-md hover:bg-frost-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!message.trim() || !isConnected || isLoading}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
        
        {/* Connection status */}
        <div className="px-3 py-1 bg-frost-800 text-frost-100 text-xs flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
    </div>
  );
}