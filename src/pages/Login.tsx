import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Login.css'; // Import file CSS

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await api.post('/users/login', { email, password });
            const { token, role } = response.data.result;

            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                alert(`Đăng nhập thành công! `);

                if (role === 'ADMIN') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/home');
                }
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            alert("Sai email hoặc mật khẩu!");
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
            <div className="auth-container login-bg w-full flex justify-center">
                <div className="auth-card">
                    <h2 className="auth-title">Chào mừng trở lại! 📚</h2>
                    <p className="auth-subtitle">Hệ thống quản lý mượn sách</p>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Email của bạn</label>
                            <input
                                type="email"
                                placeholder="admin@bookstore.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <input
                                type="password"
                                placeholder="admin123"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-submit btn-login">
                            Đăng Nhập
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;