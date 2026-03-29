import React, { useState, useEffect } from 'react';
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

    // Quản lý trạng thái ẩn/hiện mật khẩu
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Quản lý trạng thái OTP
    const [otpSent, setOtpSent] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [otp, setOtp] = useState('');

    // Quản lý đếm ngược (Countdown)
    const [countdown, setCountdown] = useState(0);

    // Logic xử lý bộ đếm ngược
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
            [name]: name === 'age' ? parseInt(value) : value
        });
    };

    const handleSendOtp = async () => {
        // 1. Validate đầu vào
        if (!formData.name || !formData.email || !formData.age || !formData.password || !formData.confirmPassword) {
            alert("Vui lòng điền đầy đủ thông tin (Tên, Email, Tuổi, Mật khẩu) trước khi nhận mã!");
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
            if (!otpSent) {
                // Gọi đăng ký để tạo tài khoản (chưa active) và gửi mail OTP
                await api.post('/users/register', formData);
                alert("Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!");
                setOtpSent(true);
            } else {
                // Nút "Gửi lại mã" được nhấn
                await api.post(`/users/resend-verification?email=${formData.email}`);
                alert("Mã OTP mới đã được gửi lại vào email của bạn!");
            }
            setCountdown(60); // Bắt đầu đếm ngược 60s
        } catch (error: any) {
            console.error("Lỗi khi gửi OTP:", error);
            let errorMessage = "Không thể gửi mã OTP. Vui lòng kiểm tra lại email hoặc backend đang lỗi.";
            if (error.response?.status === 400) {
                errorMessage = error.response.data?.message || "Email đã tồn tại hoặc dữ liệu không hợp lệ.";
            }
            alert(errorMessage);
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!otpSent) {
            alert("Vui lòng nhấn 'Nhận mã OTP' và nhập mã trước khi đăng ký để hoàn tất bảo mật!");
            return;
        }

        if (!otp || otp.length < 6) {
            alert("Vui lòng nhập đầy đủ mã OTP 6 chữ số.");
            return;
        }

        try {
            await api.post(`/users/verify-otp?email=${formData.email}&otp=${otp}`);
            alert('Đăng ký tài khoản thành công!');
            navigate('/login');
        } catch (error: any) {
            console.error("Lỗi xác thực OTP:", error);
            const errorMessage = error.response?.data?.message || "Mã OTP không chính xác hoặc đã hết hạn!";
            alert(errorMessage);
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

                    <div className="form-row" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <div className="form-group" style={{ flex: 2, marginBottom: '0' }}>
                            <label>Email</label>
                            <input name="email" type="email" placeholder="example@mail.com" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group" style={{ flex: 1, marginBottom: '0' }}>
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
                                type={showPassword ? "text" : "password"}
                                placeholder="Ít nhất 8 ký tự..."
                                value={formData.password}
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

                    {/* Ô Xác nhận mật khẩu */}
                    <div className="form-group">
                        <label>Xác nhận mật khẩu</label>
                        <div className="password-input-container">
                            <input
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Nhập lại mật khẩu"
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

                    <div className="form-group" style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fdfdfd' }}>
                        <label>Xác thực Email</label>
                        <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px', marginTop: '-5px' }}>
                            * Vui lòng điền đủ thông tin phía trên trước khi nhận mã nhé.
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Nhập mã xác thực"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required={otpSent}
                                maxLength={6}
                                disabled={!otpSent}
                                style={{ flex: 1, margin: 0 }}
                            />
                            <button
                                type="button"
                                className="btn-submit"
                                onClick={handleSendOtp}
                                disabled={isSendingOtp || countdown > 0}
                                style={{
                                    width: 'auto',
                                    padding: '0 15px',
                                    marginTop: 0,
                                    backgroundColor: (isSendingOtp || countdown > 0) ? '#6c757d' : (otpSent ? '#28a745' : '#007bff'),
                                    cursor: (isSendingOtp || countdown > 0) ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isSendingOtp ? 'Đang gửi...' : countdown > 0 ? `Đợi ${countdown}s` : otpSent ? 'Gửi lại mã' : 'Nhận mã OTP'}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn-submit btn-register" style={{ marginTop: '10px' }}>Đăng Ký Thành Viên</button>
                </form>
                <div className="auth-footer">
                    <p>Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;