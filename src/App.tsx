import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Home from './pages/User/Home';
import Register from './pages/Register';
import BookDetail from './pages/User/BookDetail';
import ProtectedRoute from './components/ProtectedRoute';
import MyBorrowHistory from './pages/User/MyBorrowHistory';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/home" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/book/:id" element={
        <ProtectedRoute>
          <BookDetail />
        </ProtectedRoute>
      } />
      <Route path="/my-borrowings" element={
        <ProtectedRoute>
          <MyBorrowHistory />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;