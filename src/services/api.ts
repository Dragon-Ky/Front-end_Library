import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // URL backend của bạn
});

// Interceptor: Cứ mỗi lần gọi api, nó sẽ tự chèn Token vào
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Lấy từ localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Thêm vào Header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Bắt lỗi 401 từ server trả về (Token hết hạn/Không hợp lệ)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Token hết hạn hoặc truy cập trái phép
            localStorage.removeItem('token');
            localStorage.removeItem('role');

            // Chuyển hướng người dùng về trang login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;