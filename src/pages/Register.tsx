import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

    // 1. Quản lý trạng thái ẩn/hiện cho 2 ô mật khẩu riêng biệt
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'age' ? parseInt(value) : value
        });
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            alert("Mật khẩu phải ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt!");
            return;
        }

        try {
            await api.post('/users/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                age: formData.age
            });
            alert("Đăng ký thành công!");
            navigate('/login');
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            alert("Đăng ký thất bại, vui lòng thử lại!");
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

                    <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
                        <div className="form-group" style={{ flex: 2 }}>
                            <label>Email</label>
                            <input name="email" type="email" placeholder="example@mail.com" value={formData.email} onChange={handleChange} required />
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