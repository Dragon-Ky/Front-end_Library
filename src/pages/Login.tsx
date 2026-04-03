import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Eye, EyeOff } from 'lucide-react';
import '../styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // State quản lý ẩn/hiện: false là ẩn (mặc định), true là hiện
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Hàm đảo trạng thái showPassword
    const togglePassword = () => setShowPassword(!showPassword);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await api.post('/users/login', { email, password });
            const { token, role } = response.data.result;

            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                alert(`Đăng nhập thành công!`);

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
        <div className="login-wrapper">
            <div className="auth-container login-bg">
                <div className="auth-card">
                    <h2 className="auth-title">Chào mừng đến với 📚</h2>
                    <p className="auth-subtitle">Hệ thống quản lý mượn sách</p>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Email của bạn</label>
                            <input
                                type="email"
                                placeholder="admin123@bookstore.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <div className="password-input-container">
                                <input
                                    // Thay đổi type dynamic dựa trên state
                                    type={showPassword ? "text" : "password"}
                                    placeholder="admin1234"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button" // Tránh việc nhấn icon bị submit form
                                    className="eye-icon-button"
                                    onClick={togglePassword}
                                    tabIndex={-1} // Bỏ qua khi nhấn Tab
                                >
                                    {/* Render có điều kiện: Ẩn cái này hiện cái kia vào cùng 1 chỗ */}
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn-submit btn-login">
                            Đăng Nhập
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p style={{ marginBottom: '8px' }}>
                            <Link to="/reset-password" style={{ color: '#007bff' }}>Quên mật khẩu?</Link>
                        </p>
                        <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;