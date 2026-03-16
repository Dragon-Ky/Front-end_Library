import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Eye, EyeOff } from 'lucide-react';
import '../styles/Login.css';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [isLoadingOTP, setIsLoadingOTP] = useState(false);
    
    // Quản lý đếm ngược (Countdown)
    const [countdown, setCountdown] = useState(0);

    const navigate = useNavigate();

    // Logic xử lý bộ đếm ngược 1 giây mỗi lần
    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSendOTP = async () => {
        if (!formData.email) {
            alert("Vui lòng nhập email trước khi gửi mã OTP!");
            return;
        }

        setIsLoadingOTP(true);
        try {
            await api.post(`/users/forgot-password?email=${formData.email}`);
            alert("Mã OTP đã được gửi đến email của bạn!");
            setOtpSent(true);
            setCountdown(60); // Bắt đầu đếm ngược 60 giây sau khi gửi thành công
        } catch (error: any) {
            console.error("Lỗi gửi OTP:", error);
            let errorMessage = error.response?.data?.message || "Lỗi hệ thống";
            
            // Nếu Backend báo lỗi Rate Limit (ví dụ: cần đợi thêm giây)
            const match = errorMessage.match(/\d+/);
            if (match) {
                let seconds = parseInt(match[0]);
                if (seconds > 60) seconds = 60; // Fix lỗi lệch múi giờ nếu có
                setCountdown(seconds);
                alert(`Vui lòng đợi ${seconds} giây nữa trước khi gửi lại.`);
            } else {
                alert("Không thể gửi OTP, email có thể không tồn tại trong hệ thống!");
            }
        } finally {
            setIsLoadingOTP(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!otpSent) {
            alert("Vui lòng gửi mã OTP trước!");
            return;
        }
        
        if (formData.newPassword !== formData.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.newPassword)) {
            alert("Mật khẩu phải ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt!");
            return;
        }

        try {
            await api.post('/users/reset-password', {
                email: formData.email,
                otp: formData.otp,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            });
            alert("Đổi mật khẩu thành công!");
            navigate('/login');
        } catch (error: any) {
            console.error("Lỗi đổi mật khẩu:", error);
            const msg = error.response?.data?.message || "Mã OTP không chính xác hoặc đã hết hạn!";
            alert(msg);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="auth-container login-bg">
                <div className="auth-card" style={{ maxWidth: '500px' }}>
                    <h2 className="auth-title">Khôi phục mật khẩu 🛡️</h2>
                    <p className="auth-subtitle">Nhập email của bạn để nhận mã OTP</p>

                    <form onSubmit={handleResetPassword} className="auth-form">
                        <div className="form-group">
                            <label>Email của bạn</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="example@mail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={{ flex: 1 }}
                                />
                                <button 
                                    type="button" 
                                    className="btn-submit" 
                                    onClick={handleSendOTP} 
                                    // Vô hiệu hóa nút khi đang load hoặc đang đếm ngược
                                    disabled={isLoadingOTP || countdown > 0}
                                    style={{ 
                                        width: 'auto', 
                                        padding: '0 15px', 
                                        marginTop: 0, 
                                        backgroundColor: (isLoadingOTP || countdown > 0) ? '#6c757d' : (otpSent ? '#28a745' : '#007bff'),
                                        cursor: (isLoadingOTP || countdown > 0) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {isLoadingOTP ? 'Đang gửi...' : countdown > 0 ? `Đợi ${countdown}s` : otpSent ? 'Gửi lại mã' : 'Gửi mã OTP'}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Mã OTP</label>
                            <input
                                name="otp"
                                type="text"
                                placeholder="Nhập mã 6 chữ số..."
                                value={formData.otp}
                                onChange={handleChange}
                                required
                                disabled={!otpSent}
                                maxLength={6}
                            />
                        </div>

                        <div className="form-group">
                            <label>Mật khẩu mới</label>
                            <div className="password-input-container">
                                <input
                                    name="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Ít nhất 8 ký tự..."
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <button 
                                    type="button" 
                                    className="eye-icon-button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Xác nhận mật khẩu mới</label>
                            <div className="password-input-container">
                                <input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Nhập lại mật khẩu..."
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <button 
                                    type="button" 
                                    className="eye-icon-button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn-submit btn-login" style={{ marginTop: '10px' }}>
                            Đổi Mật Khẩu
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Nhớ mật khẩu? <Link to="/login">Đăng nhập ngay</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;