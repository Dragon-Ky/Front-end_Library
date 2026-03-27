import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles } from 'lucide-react';
import { chatService } from '../../services/chatService';
import type { ChatMessage } from '../../types/chat';
import ChatMessageItem from './ChatMessageItem';
import './ChatBox.css';

const ChatBox: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([{
        id: '1',
        sender: 'bot',
        content: 'Xin chào! Tôi là AI Hỗ trợ Thư viện. Bạn muốn tìm sách gì hôm nay?',
    }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        const trimmedInput = input.trim();
        if (!trimmedInput || isLoading) return;

        const newUserMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            content: trimmedInput,
        };

        setMessages((prev) => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Call API
            const books = await chatService.searchBooksQuery(trimmedInput);
            
            const newBotMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                content: books.length > 0 
                    ? `Tôi đã tìm thấy ${books.length} cuốn sách phù hợp với yêu cầu của bạn:` 
                    : 'Xin lỗi, tôi không tìm thấy cuốn sách nào phù hợp với yêu cầu của bạn.',
                books: books,
            };

            setMessages((prev) => [...prev, newBotMessage]);
        } catch (error) {
            console.error('Error fetching chat response:', error);
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                content: 'Xin lỗi, đã xảy ra lỗi trong quá trình xử lý yêu cầu. Vui lòng thử lại sau.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="chatbox-container">
            {/* Toggle Button */}
            <button 
                className={`chatbox-toggle-btn ${isOpen ? 'open' : ''}`}
                onClick={toggleChat}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>

            {/* Chat Window */}
            <div className={`chatbox-window ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="chatbox-header">
                    <div className="chatbox-header-title">
                        <Sparkles size={18} className="chatbot-icon" />
                        <div>
                            <h3>AI Assistant</h3>
                            <span className="chatbox-status">Trợ lý thư viện thông minh</span>
                        </div>
                    </div>
                    <button className="chatbox-close-btn" onClick={toggleChat}>
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="chatbox-messages">
                    {messages.map((msg) => (
                        <ChatMessageItem key={msg.id} message={msg} />
                    ))}
                    
                    {isLoading && (
                        <div className="chat-message-wrapper bot">
                            <div className="chat-avatar">
                                <Sparkles size={16} />
                            </div>
                            <div className="chat-message-content">
                                <div className="chat-bubble loading">
                                    <Loader2 className="spinner" size={16} />
                                    <span>Đang tìm sách...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="chatbox-input-area">
                    <form onSubmit={handleSend} className="chatbox-input-form">
                        <input 
                            type="text" 
                            placeholder="Nhập thông tin sách cần tìm..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button 
                            type="submit" 
                            className="chatbox-send-btn"
                            disabled={!input.trim() || isLoading}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
