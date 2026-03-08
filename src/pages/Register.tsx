import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: 18 // Mặc định 18 tuổi
    });

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

        // 1. Kiểm tra khớp mật khẩu
        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        // 2. Regex kiểm tra mật khẩu mạnh (khớp với backend @Pattern)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            alert("Mật khẩu phải ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt!");
            return;
        }

        try {
            // Gửi đúng các trường backend yêu cầu trong UserCreationRequest
            await api.post('/users/register', {
                email: formData.email,
                name: formData.name,
                password: formData.password,
                age: formData.age
            });

            alert("Đăng ký thành công! Hãy đăng nhập.");
            navigate('/login');
        } catch (error: any) {
            // Hiển thị message lỗi từ backend nếu có (ví dụ: EMAIL_NOT_BLANK)
            const errorMsg = error.response?.data?.message || "Đăng ký thất bại!";
            alert("Lỗi: " + errorMsg);
        }
    };

    return (
        <div className="auth-container register-bg">
            <div className="auth-card register-card">
                <h2 className="auth-title">Tạo tài khoản ✨</h2>
                
                <form onSubmit={handleRegister} className="auth-form">
                    <div className="form-group">
                        <label>Họ và tên</label>
                        <input
                            name="name"
                            type="text"
                            placeholder="Nguyễn Văn A"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group flex-2">
                            <label>Email</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group flex-1">
                            <label>Tuổi</label>
                            <input
                                name="age"
                                type="number"
                                min="5"
                                max="100"
                                value={formData.age}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Ít nhất 8 ký tự (A, a, 1, @...)"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Xác nhận mật khẩu</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-submit btn-register">
                        Đăng Ký Thành Viên
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;