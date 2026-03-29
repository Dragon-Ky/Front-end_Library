import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/BookDetail.css";
interface Book {
    id: number;
    title: string;
    author: string;
    categories: string[];
    description: string;

    image?: string;
}


const BookDetail = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const navigate = useNavigate();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);

    const handleBorrow = async () => {

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Vui lòng đăng nhập!");
            navigate("/login");
            return;
        }

        if (!window.confirm(`Bạn muốn mượn cuốn "${book?.title}"?`)) return;

        try {

            const response = await api.post("/borrow", {
                bookId: book?.id,
                title: book?.title,
                image: book?.image
            });

            if (response.data.code === 1000) {
                alert(response.data.message || "Mượn sách thành công!");
            }

        } catch (error: any) {

            const errorMsg = error.response?.data?.message || "Không thể mượn sách!";
            alert("Lỗi: " + errorMsg);

        }
    };
    useEffect(() => {
        const fetchBookDetail = async () => {
            try {
                const response = await api.get(`/books/${id}`);
                setBook(response.data.result);
            } catch (error) {
                console.error("Lỗi lấy chi tiết sách:", error);
                alert("Không tìm thấy thông tin sách!");
                navigate('/home');
            } finally {
                setLoading(false);
            }
        };
        fetchBookDetail();
    }, [id, navigate]);

    if (loading) return <div className="loading-screen">Đang tải chi tiết sách...</div>;
    if (!book) return null;

    return (
        <div className="detail-page">
            <div className="detail-container max-w-4xl w-full bg-white shadow-md rounded-xl p-8">
                <button className="btn-back" onClick={() => navigate(-1)}>
                    ❮ Quay lại danh sách
                </button>

                <div className="detail-main">
                    {/* Cột trái: Ảnh sách */}
                    <div className="detail-left">
                        <div className="image-frame">
                            <img src={book.image || 'https://via.placeholder.com/400x550'} alt={book.title} />
                        </div>
                    </div>

                    {/* Cột phải: Thông tin chi tiết */}
                    <div className="detail-right">
                        <div className="detail-categories-wrapper">
                            {Array.isArray(book.categories) ? book.categories.map((cat, i) => (
                                <span key={i} className="detail-category">{cat}</span>
                            )) : <span className="detail-category">{book.categories || ''}</span>}
                        </div>
                        <h1 className="detail-title">{book.title}</h1>
                        <div className="detail-meta">
                            <span>Tác giả: <strong>{book.author}</strong></span>
                        </div>

                        <div className="detail-actions">
                            <button
                                className="btn-borrow-big"
                                onClick={handleBorrow}
                            >
                                Mượn sách ngay
                            </button>
                        </div>

                        <div className="detail-description-section">
                            <h3>Thông tin chi tiết</h3>
                            {/* Đây là nơi xử lý xuống dòng */}
                            <p className="detail-description-text">
                                {book.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;