import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import ChatBox from '../../components/ChatBox/ChatBox';
import '../../styles/Home.css';

interface Book {
    id: number;
    title: string;
    author: string;
    categories: string[];
    description: string;
    availableQuantity: number;
    image?: string;
}

const Home = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const pageSize = 10;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            if (searchKeyword.trim() === '') {
                fetchBooks(currentPage);
            }
        }
    }, [navigate, currentPage, searchKeyword]);

    const fetchBooks = async (page: number) => {
        setLoading(true);
        try {
            const response = await api.get(`/books?page=${page}&size=${pageSize}`);
            const { content, totalPages } = response.data.result;
            setBooks(content);
            setTotalPages(totalPages);
        } catch (error) {
            console.error('Lỗi tải danh sách sách:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            navigate('/login');
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchKeyword.trim()) {
            fetchBooks(1);
            return;
        }

        setLoading(true);
        try {
            // Gọi đúng endpoint: /books/search?keyword=...
            const response = await api.get(`/books/search?keyword=${searchKeyword}`);
            // API trả về List<BookResponse> trực tiếp trong result
            setBooks(response.data.result);
            setTotalPages(0); // Ẩn phân trang khi tìm kiếm
        } catch (error) {
            console.error('Lỗi tìm kiếm:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBorrow = async (book: Book) => {
        // Kiểm tra số lượng tại máy khách trước khi gửi yêu cầu mượn
        if (book.availableQuantity <= 0) {
            alert("Sách này đã hết trong kho!");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert("Vui lòng đăng nhập để mượn sách!");
            navigate('/login');
            return;
        }

        if (!window.confirm(`Bạn muốn mượn cuốn "${book.title}"?`)) return;

        try {
            const response = await api.post('/borrow', {
                bookId: book.id,
                title: book.title,
                image: book.image,
            });

            if (response.data.code === 1000) {
                alert(response.data.message);
                fetchBooks(currentPage); // Tải lại để cập nhật số lượng mới nhất
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || "Không thể mượn sách!";
            alert("Lỗi: " + errorMsg);
        }
    };

    const handleViewDetails = (bookId: number) => {
        navigate(`/book/${bookId}`);
    };

    return (
        <div className="home-wrapper">
            <div className="home-container">
                <div className="section-header">
                    <h2 className="section-title">DANH MỤC SÁCH THƯ VIỆN 📚</h2>
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sách..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="btn-action btn-primary" style={{ padding: '8px 20px', flex: 'none' }}>
                            Tìm
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div className="status-msg">Đang kết nối thư viện...</div>
                ) : (
                    <div className="book-grid-custom">
                        {books.map((book) => (
                            <div key={book.id} className="book-card-item">
                                <div className="book-img-box">
                                    <img
                                        src={book.image || 'https://via.placeholder.com/200x280?text=Book+Cover'}
                                        alt={book.title}
                                    />
                                </div>

                                <div className="book-body">
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                                        {Array.isArray(book.categories) ? book.categories.map((cat, i) => (
                                            <span key={i} className="book-tag">{cat}</span>
                                        )) : <span className="book-tag">{(book as any).categories || ''}</span>}
                                    </div>

                                    <h3 className="book-title-text" title={book.title}>
                                        {book.title}
                                    </h3>

                                    <p className="book-meta-data">
                                        <b>Tác giả:</b> {book.author}
                                    </p>

                                    <div className="fhs-progress-container">
                                        <div className="fhs-progress-bar">
                                            <div
                                                className="fhs-progress-fill"
                                                style={{ width: `${Math.min((book.availableQuantity / 50) * 100, 100)}%` }}
                                            ></div>

                                            <span className="fhs-progress-text">
                                                {book.availableQuantity > 0
                                                    ? `Còn lại ${book.availableQuantity}`
                                                    : "Hết sách"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="book-actions-footer">
                                        <button
                                            className="btn-action btn-outline"
                                            onClick={() => handleViewDetails(book.id)}
                                        >
                                            Chi tiết
                                        </button>

                                        <button
                                            disabled={book.availableQuantity <= 0}
                                            className={`btn-action btn-primary ${book.availableQuantity <= 0 ? 'disabled' : ''}`}
                                            onClick={() => handleBorrow(book)}
                                        >
                                            Mượn sách
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Phân trang */}
                {!loading && totalPages > 0 && (
                    <div className="pagination-bar">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Trước</button>
                        <span className="page-info">{currentPage} / {totalPages}</span>
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Sau</button>
                    </div>
                )}
            </div>
            {/* Thêm ChatBox vào trang chủ */}

            <div className="fixed-actions-container">
                <ChatBox />
                <button
                    onClick={() => navigate('/my-borrowings')}
                    className="float-btn btn-borrowings"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Sách đã mượn
                </button>
                <button
                    onClick={handleLogout}
                    className="float-btn btn-logout"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Đăng xuất
                </button>
            </div>


        </div>
    );
};

export default Home;