import axios, { type InternalAxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';

// 1. Khởi tạo instance với cấu hình chính xác
const api = axios.create({
    // SỬA TẠI ĐÂY: Thay bằng URL Backend của bạn trên Render
    // Ví dụ: https://bookstore-api-xxxx.onrender.com
    baseURL: 'https://bookstore-api-abb8.onrender.com', 
    headers: {
        'Content-Type': 'application/json',
    }
});

// 2. Interceptor cho Request: Tự động đính kèm JWT Token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            // Thêm Bearer Token vào header Authorization
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// 3. Interceptor cho Response
api.interceptors.response.use(
    (response: AxiosResponse) => {
        // Lưu ý: Nếu Backend trả về { result: { token: ... } }
        // Thì ở đây bạn nên log ra để kiểm tra cấu hình
        return response;
    },
    (error: AxiosError) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api; 