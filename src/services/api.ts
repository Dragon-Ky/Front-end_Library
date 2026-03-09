import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// 1. Khởi tạo instance với cấu hình cơ bản
const api = axios.create({
    // Lưu ý: Khi deploy lên Render, hãy thay localhost thành URL của Back-end Render
    baseURL: 'https://backend-cua-ban.onrender.com', 
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
        // Xử lý lỗi khi gửi request
        return Promise.reject(error);
    }
);

// 3. Interceptor cho Response: Xử lý dữ liệu trả về và lỗi tập trung
api.interceptors.response.use(
    (response: AxiosResponse) => {
        // Trả về dữ liệu trực tiếp nếu thành công
        return response;
    },
    (error: AxiosError) => {
        // Kiểm tra nếu lỗi từ Server trả về (401: Hết hạn token, 403: Không có quyền)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Xóa sạch thông tin cũ để đảm bảo an toàn
            localStorage.removeItem('token');
            localStorage.removeItem('role');

            // Điều hướng về trang login nếu không phải đang ở trang login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;