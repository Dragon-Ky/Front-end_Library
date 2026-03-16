import React, { useState } from 'react';
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

    const navigate = useNavigate();

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
        } catch (error) {
            console.error("Lỗi gửi OTP:", error);
            alert("Không thể gửi OTP, email có thể không tồn tại trong hệ thống!");
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
        } catch (error) {
            console.error("Lỗi đổi mật khẩu:", error);
            alert("Đổi mật khẩu thất bại, mã OTP có thể không chính xác hoặc đã hết hạn!");
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
                                    disabled={isLoadingOTP}
                                    style={{ width: 'auto', padding: '0 15px', marginTop: 0, backgroundColor: otpSent ? '#28a745' : '#007bff' }}
                                >
                                    {isLoadingOTP ? 'Đang gửi...' : otpSent ? 'Gửi lại mã' : 'Gửi mã OTP'}
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
