import React from 'react';
import type { ChatMessage, Book } from '../../types/chat';
import { Bot, User, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatMessageItemProps {
    message: ChatMessage;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
    const isBot = message.sender === 'bot';
    const navigate = useNavigate();

    const handleViewDetails = (bookId: number) => {
        navigate(`/book/${bookId}`);
    };

    return (
        <div className={`chat-message-wrapper ${isBot ? 'bot' : 'user'}`}>
            <div className="chat-avatar">
                {isBot ? <Bot size={20} /> : <User size={20} />}
            </div>
            
            <div className="chat-message-content">
                <div className="chat-bubble">
                    <p>{message.content}</p>
                </div>

                {/* Render sách nếu có */}
                {message.books && message.books.length > 0 && (
                    <div className="chat-books-carousel">
                        {message.books.map((book: Book) => (
                            <div key={book.id} className="chat-book-card">
                                <img 
                                    src={book.image || 'https://via.placeholder.com/100x140?text=Book'} 
                                    alt={book.title} 
                                    className="chat-book-img"
                                />
                                <div className="chat-book-info">
                                    <h4 title={book.title}>{book.title}</h4>
                                    <span className="chat-book-author">{book.author}</span>
                                    <button 
                                        className="chat-book-btn"
                                        onClick={() => handleViewDetails(book.id)}
                                    >
                                        <BookOpen size={14} style={{ marginRight: 4 }} />
                                        Xem Chi Tiết
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatMessageItem;
