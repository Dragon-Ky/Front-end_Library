import api from './api';
import type { Book, ApiResponse } from '../types/chat';

class ChatService {
    /**
     * Gửi tin nhắn tới AI và nhận về danh sách gợi ý sách.
     * @param message Tin nhắn người dùng
     */
    async searchBooksQuery(message: string): Promise<Book[]> {
        const response = await api.post<ApiResponse<Book[]>>('/api/chat/search', { message });
        return response.data.result;
    }
}

export const chatService = new ChatService();
