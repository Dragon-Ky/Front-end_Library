export interface Book {
    id: number;
    title: string;
    author: string;
    category: string;
    description: string;
    availableQuantity: number;
    image?: string;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    result: T;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'bot';
    content: string;
    books?: Book[];
}
