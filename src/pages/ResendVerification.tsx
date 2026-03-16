import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Login.css';

const ResendVerification = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleResend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!email) {
            alert("Vui lòng nhập email!");
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            // Lưu ý: Đảm bảo backend của bạn có API này
            await api.post(`/users/resend-verification?email=${email}`);
            setMessage('Email kích hoạt đã được gửi lại! Vui lòng kiểm tra hộp thư của bạn.');
        } catch (error) {
            console.error("Lỗi gửi lại email:", error);
            alert("Không thể gửi lại email rắc rối. Vui lòng kiểm tra lại địa chỉ email hoặc tài khoản đã được kích hoạt.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="auth-container login-bg">
                <div className="auth-card" style={{ maxWidth: '500px' }}>
                    <h2 className="auth-title">Gửi lại email kích hoạt 📧</h2>
                    <p className="auth-subtitle">Nhập email bạn đã dùng để đăng ký tài khoản</p>

                    <form onSubmit={handleResend} className="auth-form">
                        <div className="form-group">
                            <label>Email của bạn</label>
                            <input
                                type="email"
                                placeholder="example@mail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {message && (
                            <div style={{ marginBottom: '15px', color: '#00af50', textAlign: 'center', fontWeight: 'bold' }}>
                                {message}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="btn-submit btn-login" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang gửi...' : 'Gửi lại email'}
                        </button>
                    </form>

                    <div className="auth-footer" style={{ marginTop: '20px' }}>
                        <p>Đã nhận được email? <Link to="/login">Đăng nhập</Link></p>
                        <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResendVerification;
