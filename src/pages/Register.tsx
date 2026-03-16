import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Eye, EyeOff } from 'lucide-react'; // Import icon
import '../styles/Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: 18
    });

    const navigate = useNavigate();

    // 1. Quản lý trạng thái ẩn/hiện cho 2 ô mật khẩu riêng biệt
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [otp, setOtp] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'age' ? parseInt(value) : value
        });
    };

    const handleSendOtp = async () => {
        if (!formData.name || !formData.email || !formData.age || !formData.password || !formData.confirmPassword) {
            alert("Vui lòng điền đầy đủ thông tin (Tên, Email, Tuổi, Mật khẩu) trước khi xác thực!");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            alert("Mật khẩu phải ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt!");
            return;
        }

        setIsSendingOtp(true);
        try {
            await api.post('/users/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                age: formData.age
            });
            setOtpSent(true);
            alert("Mã OTP đã được gửi đến email của bạn!");
        } catch (error) {
            // Nếu email đã được đăng ký nhưng chưa xác thực, thử gọi API gửi lại mã
            try {
                await api.post(`/users/resend-verification?email=${formData.email}`);
                setOtpSent(true);
                alert("Mã OTP đã được gửi lại!");
            } catch (resendError) {
                console.error("Lỗi gửi OTP:", resendError);
                alert("Email đã tồn tại và đã được kích hoạt, hoặc xảy ra lỗi!");
            }
        } finally {
            setIsSendingOtp(false);
        }
    };


    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!otpSent) {
            alert("Vui lòng nhấn 'Xác thực' để nhận mã OTP trước khi đăng ký!");
            return;
        }

        if (otp.length !== 6) {
            alert("Mã OTP phải bao gồm 6 số!");
            return;
        }

        try {
            await api.post(`/users/verify-otp?email=${formData.email}&otp=${otp}`);
            alert('Đăng ký tài khoản thành công!');
            navigate('/login');
        } catch (error) {
            console.error("Lỗi xác thực:", error);
            alert("Mã OTP không hợp lệ hoặc đã hết hạn!");
        }
    };

    return (
        <div className="auth-container login-bg">
            <div className="auth-card">
                <h2 className="auth-title">Tạo tài khoản 🚀</h2>
                <form onSubmit={handleRegister} className="auth-form">
                    <div className="form-group">
                        <label>Họ và tên</label>
                        <input name="name" type="text" placeholder="Nguyễn Văn A" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label>Email</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input name="email" type="email" placeholder="example@mail.com" value={formData.email} onChange={handleChange} required style={{ flex: 1 }} />
                            <button 
                                type="button" 
                                className="btn-submit" 
                                onClick={handleSendOtp} 
                                disabled={isSendingOtp}
                                style={{ width: 'auto', padding: '0 15px', marginTop: 0, backgroundColor: otpSent ? '#28a745' : '#007bff' }}
                            >
                                {isSendingOtp ? 'Đang gửi...' : otpSent ? 'Gửi lại mã' : 'Xác thực'}
                            </button>
                        </div>
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
                        <div className="form-group" style={{ flex: 2 }}>
                            <label>Mã OTP</label>
                            <input type="text" placeholder="Nhập mã 6 số" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} disabled={!otpSent} />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Tuổi</label>
                            <input name="age" type="number" value={formData.age} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Ô Mật khẩu chính */}
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <div className="password-input-container">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"} // Logic ẩn hiện
                                placeholder="Ít nhất 8 ký tự..."
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button 
                                type="button" 
                                className="eye-icon-button"
                                onClick={() => setShowPassword(!showPassword)} // Đảo trạng thái
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Ô Xác nhận mật khẩu */}
                    <div className="form-group">
                        <label>Xác nhận mật khẩu</label>
                        <div className="password-input-container">
                            <input
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"} // Logic ẩn hiện
                                placeholder="Nhập lại mật khẩu"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <button 
                                type="button" 
                                className="eye-icon-button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Đảo trạng thái
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn-submit btn-register">Đăng Ký Thành Viên</button>
                </form>
                <div className="auth-footer">
                    <p>Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;