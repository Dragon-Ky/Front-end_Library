import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

import '../../styles/AdminDashboard.css';
import BorrowManager from './BorrowManager';

// Interface khớp 100% với BookResponse/BookRequest bên Java
interface Book {
    id?: number;
    title: string;
    author: string;
    categories: string[];
    totalQuantity: number; // Phải là totalQuantity mới khớp Backend
    availableQuantity: number;
    description: string;
    image?: string; // Chuỗi Base64
}

const BookManager = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);

    // State Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 5;

    // State Modal & Form
    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [formData, setFormData] = useState<Book>({
        title: '',
        author: '',
        categories: [],
        totalQuantity: 0,
        availableQuantity: 0,
        description: '',
        image: ''
    });
    const [categoriesText, setCategoriesText] = useState('');

    useEffect(() => {
        fetchBooks(currentPage);
    }, [currentPage]);

    // 1. Hàm chuyển ảnh file sang chuỗi Base64
    const convertBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result as string);
            fileReader.onerror = (error) => reject(error);
        });
    };

    // 2. Xử lý khi chọn file ảnh
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64 = await convertBase64(file);
            setFormData({ ...formData, image: base64 });
        }
    };

    // 3. Lấy danh sách (READ) - Lấy tất cả và phân trang ở Frontend
    const fetchBooks = async (page: number) => {
        setLoading(true);
        try {
            // Lấy toàn bộ sách (size lớn) để Frontend tự đếm và phân trang
            const response = await api.get(`/books?page=1&size=10000`);

            if (response.data.result) {
                let allBooks: Book[] = [];
                
                // Trích xuất toàn bộ mảng sách trả về
                if (Array.isArray(response.data.result)) {
                    allBooks = response.data.result;
                } else if (response.data.result.content) {
                    allBooks = response.data.result.content;
                }

                // Tự tính tổng số trang dựa trên mảng sách thu được
                const calculatedTotalPages = Math.ceil(allBooks.length / pageSize) || 1;
                
                // Trích xuất các cuốn sách dành cho trang hiện tại
                const startIndex = (page - 1) * pageSize;
                const pageContent = allBooks.slice(startIndex, startIndex + pageSize);
                
                setBooks(pageContent);
                setTotalPages(calculatedTotalPages);
                
                // Đảm bảo không bị quá trang khi xóa sách
                if (page > calculatedTotalPages && calculatedTotalPages > 0) {
                    setCurrentPage(calculatedTotalPages);
                }
            }
        } catch (error) {
            console.error('Lỗi:', error);
        } finally {
            setLoading(false);
        }
    };

    // 4. Xử lý Thêm/Sửa (CREATE & UPDATE)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBook) {
                // Update: PUT /books/{id}
                await api.put(`/books/${editingBook.id}`, formData);
                alert('Cập nhật thành công!');
            } else {
                // Create: POST /books
                await api.post('/books', formData);
                alert('Thêm sách mới thành công!');
            }
            handleCloseModal();
            fetchBooks(currentPage);
        } catch (error) {
            alert('Lỗi lưu sách! Hãy kiểm tra dung lượng ảnh hoặc tên field.');
        }
    };

    // 5. Xóa sách (DELETE)
    const handleDelete = async (id: number) => {
        if (window.confirm('Xác nhận xóa cuốn sách này?')) {
            try {
                await api.delete(`/books/${id}`);
                fetchBooks(currentPage);
            } catch (error) {
                alert('Lỗi khi xóa');
            }
        }
    };

    const handleEditClick = (book: Book) => {
        setEditingBook(book);
        setFormData({ ...book });
        setCategoriesText(Array.isArray(book.categories) ? book.categories.join(', ') : book.categories || '');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingBook(null);
        setFormData({ title: '', author: '', categories: [], totalQuantity: 0, availableQuantity: 0, description: '', image: '' });
        setCategoriesText('');
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Quản lý kho sách</h2>
                <div className="flex gap-4">
                    <button onClick={() => setShowModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        + Thêm sách mới
                    </button>
                    {/* Logout button was moved out to Dashboard frame */}
                </div>
            </div>

            {/* Bảng hiển thị */}
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Ảnh</th>
                            <th>Tên sách</th>
                            <th>Tác giả</th>
                            <th>Thể loại</th>
                            <th>Mô tả</th>
                            <th>Số lượng</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="loading-state">Đang tải dữ liệu...</td></tr>
                        ) : books.length === 0 ? (
                            <tr><td colSpan={7} className="empty-state">Không có dữ liệu sách</td></tr>
                        ) : books.map((book) => (
                            <tr key={book.id}>
                                <td className="book-image-cell">
                                    <img src={book.image || 'https://via.placeholder.com/60x80'} alt="book" className="book-image" />
                                </td>
                                <td>
                                    <div className="book-title">{book.title}</div>
                                </td>
                                <td>
                                    <div className="book-author" title={book.author}>{book.author}</div>
                                </td>
                                <td>
                                    <div className="book-categories-container">
                                        {Array.isArray(book.categories) ? (
                                            book.categories.map((cat, index) => (
                                                <span key={index} className="book-category">{cat}</span>
                                            ))
                                        ) : (
                                            <span className="book-category">{book.categories}</span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <p className="book-description" title={book.description}>
                                        {book.description || '-'}
                                    </p>
                                </td>
                                <td>
                                    <div className="quantity-info">
                                        <span className="badge badge-total">Tổng: {book.totalQuantity}</span>
                                        <span className="badge badge-available">Còn: {book.availableQuantity}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => handleEditClick(book)} className="action-btn action-btn-edit">Sửa</button>
                                        <button onClick={() => handleDelete(book.id!)} className="action-btn action-btn-delete">Xóa</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <div className="admin-pagination">
                <button disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)} className="pagination-btn">Trước</button>
                <span className="pagination-info">Trang {currentPage > (totalPages || 1) ? (totalPages || 1) : currentPage} / {totalPages || 1}</span>
                <button disabled={currentPage >= (totalPages || 1)} onClick={() => setCurrentPage(p => p + 1)} className="pagination-btn">Sau</button>
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-header">{editingBook ? 'Sửa thông tin sách' : 'Thêm sách mới'}</h3>
                        <form onSubmit={handleSubmit}>
                            {/* Input File Ảnh */}
                            <div className="form-group">
                                <label className="form-label">Ảnh sách</label>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="form-input file-input" />
                                {formData.image && (
                                    <div className="image-preview-container">
                                        <img src={formData.image} className="book-image-preview" alt="preview" />
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tên sách</label>
                                <input type="text" placeholder="Nhập tên sách..." value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required className="form-input" />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Tác giả</label>
                                    <input type="text" placeholder="Tên tác giả..." value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} required className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Thể loại</label>
                                    <input type="text" placeholder="Thể loại (cách nhau dấu phẩy)..." value={categoriesText} onChange={e => { setCategoriesText(e.target.value); setFormData({ ...formData, categories: e.target.value.split(',').map(c => c.trim()).filter(c => c !== '') }); }} required className="form-input" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Số lượng tổng</label>
                                <input type="number" placeholder="0" value={formData.totalQuantity} onChange={e => setFormData({ ...formData, totalQuantity: Number(e.target.value) })} required className="form-input" min="0" />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Mô tả</label>
                                <textarea placeholder="Viết mô tả về cuốn sách..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="form-textarea" rows={3} />
                            </div>

                            <div className="form-actions">
                                <button type="button" onClick={handleCloseModal} className="btn-cancel">Hủy bỏ</button>
                                <button type="submit" className="btn-save">{editingBook ? 'Cập nhật' : 'Lưu thông tin'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<'books' | 'borrowings'>('books');
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            navigate('/login');
        }
    };

    // const handleCleanup = async () => {
    //     if (window.confirm('Bạn có chắc chắn muốn dọn dẹp các tài khoản rác (chưa kích hoạt)?')) {
    //         try {
    //             const response = await api.delete('/users/cleanup');
    //             alert(response.data || 'Đã dọn dẹp sạch tài khoản ảo!');
    //         } catch (error) {
    //             console.error('Lỗi khi dọn dẹp:', error);
    //             alert('Có lỗi xảy ra khi dọn dẹp tài khoản.');
    //         }
    //     }
    // };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Navbar / Header */}
            <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Cổng Quản Trị Hệ Thống</h1>

            </div>

            {/* Tab Navigation */}
            <div className="px-6 py-4 flex gap-4 border-b bg-white">
                <button
                    onClick={() => setActiveTab('books')}
                    className={`font-semibold pb-2 px-4 transition-colors ${activeTab === 'books' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
                >
                    Quản Lý Sách
                </button>
                <button
                    onClick={() => setActiveTab('borrowings')}
                    className={`font-semibold pb-2 px-4 transition-colors ${activeTab === 'borrowings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
                >
                    Quản Lý Mượn Trả
                </button>
            </div>

            {/* Content Area */}
            <div className="p-4">
                {activeTab === 'books' ? <BookManager /> : <BorrowManager />}
            </div>
            <div className="flex gap-4 px-6 pb-6 mt-4">
                {/* <button onClick={handleCleanup} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Dọn tài khoản rác
                </button> */}
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;