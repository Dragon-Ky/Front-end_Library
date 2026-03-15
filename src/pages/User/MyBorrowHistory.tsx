import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/MyBorrowHistory.css";

interface BorrowResponse {
    id: number;
    bookTitle?: string;
    borrow_date?: string;
    due_date?: string;
    return_date?: string | null;
    status?: string;
    [key: string]: any;
}

const MyBorrowHistory = () => {
    const [borrowings, setBorrowings] = useState<BorrowResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyBorrowings();
    }, []);

    const fetchMyBorrowings = async () => {
        setLoading(true);
        try {
            const response = await api.get("/borrow/my-history");

            if (response.data.result) {
                setBorrowings(response.data.result);
            } else if (Array.isArray(response.data)) {
                setBorrowings(response.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy lịch sử mượn:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date?: string) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("vi-VN");
    };

    const getStatusClass = (status?: string) => {
        const st = status?.toUpperCase();

        if (st === "RETURNED") return "status status-returned";
        if (st === "BORROWED") return "status status-borrowed";
        if (st === "LOST") return "status status-lost";

        return "status status-default";
    };

    const getStatusText = (status?: string) => {
        const st = status?.toUpperCase();

        if (st === "RETURNED") return "ĐÃ TRẢ";
        if (st === "BORROWED") return "ĐANG MƯỢN";
        if (st === "LOST") return "MẤT SÁCH";

        return st || "-";
    };

    return (
        <div className="borrow-page">

            {/* Header */}
            <div className="header-bar">

                <div
                    className="back-button"
                    onClick={() => navigate("/home")}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="back-icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>

                    Trang chủ
                </div>

                <div className="page-title">
                    Lịch Sử Mượn Sách
                </div>

                <div style={{ width: "80px" }}></div>
            </div>

            {/* Content */}
            <div className="borrow-container">

                <div className="action-bar">
                    <button
                        className="refresh-btn"
                        onClick={fetchMyBorrowings}
                    >
                        Làm mới
                    </button>
                </div>

                <table className="borrow-table">
                    <thead>
                        <tr>
                            <th className="text-center">Mã</th>
                            <th>Tên Sách</th>
                            <th className="text-center">Ngày Mượn</th>
                            <th className="text-center">Hạn Trả</th>
                            <th className="text-center">Ngày Trả</th>
                            <th className="text-center">Trạng Thái</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="empty-row">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : borrowings.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="empty-row">
                                    Bạn chưa mượn cuốn sách nào
                                </td>
                            </tr>
                        ) : (
                            borrowings.map((item) => (
                                <tr key={item.id}>
                                    <td className="text-center">#{item.id}</td>

                                    <td>
                                        {item.bookTitle || item.book?.title || "-"}
                                    </td>

                                    <td className="text-center">
                                        {formatDate(item.borrowDate)}
                                    </td>

                                    <td className="text-center">
                                        {formatDate(item.dueDate)}
                                    </td>

                                    <td className="text-center">
                                        {formatDate(item.returnDate || "")}
                                    </td>

                                    <td className="text-center">
                                        <span className={getStatusClass(item.status)}>
                                            {getStatusText(item.status)}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

            </div>
        </div>
    );
};

export default MyBorrowHistory;