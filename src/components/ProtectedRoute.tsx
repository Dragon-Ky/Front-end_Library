import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin }: ProtectedRouteProps) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Nếu không có token -> chưa đăng nhập -> văng ra trang login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Nếu vào route admin mà role không phải là ADMIN -> đuổi về trang chủ hoặc bắt đăng nhập lại
    if (requireAdmin && role !== 'ADMIN') {
        return <Navigate to="/login" replace />;
    }

    // Hợp lệ thì cho render component con bên trong
    return children;
};

export default ProtectedRoute;
