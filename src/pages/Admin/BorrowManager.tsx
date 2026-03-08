import { useState, useEffect } from 'react';
import api from '../../services/api';

interface BorrowResponse {
    id: number;
    email?: string;
    name?: string;
    bookTitle?: string;
    borrowDate?: string;
    dueDate?: string;
    returnDate?: string | null;

    status?: string;
    [key: string]: any; // fallback for other fields from backend
}

const BorrowManager = () => {
    const [borrowings, setBorrowings] = useState<BorrowResponse[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBorrowings();
    }, []);

    const fetchBorrowings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/borrow/all-history');
            if (response.data.result) {
                setBorrowings(response.data.result);
            } else if (Array.isArray(response.data)) {
                setBorrowings(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách mượn sách:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReturnBook = async (recordId: number) => {
        if (window.confirm('Xác nhận trả cuốn sách này?')) {
            try {
                const response = await api.post(`/borrow/${recordId}/return`);
                if (response.data.code === 1000) {
                    alert('Trả sách thành công!');
                    fetchBorrowings(); // Refresh data
                } else {
                    alert(response.data.message || 'Có lỗi xảy ra');
                }
            } catch (error) {
                console.error('Lỗi khi trả sách:', error);
                alert('Lỗi khi thao tác trả sách');
            }
        }
    };

    const handleReportLost = async (recordId: number) => {
        if (window.confirm('Xác nhận báo mất cuốn sách này?')) {
            try {
                const response = await api.post(`/borrow/${recordId}/lost`);
                if (response.data.code === 1000) {
                    alert('Ghi nhận mất sách thành công!');
                    fetchBorrowings(); // Refresh data
                } else {
                    alert(response.data.message || 'Có lỗi xảy ra');
                }
            } catch (error) {
                console.error('Lỗi khi báo mất sách:', error);
                alert('Lỗi khi thao tác báo mất sách');
            }
        }
    };

    // Helper to safely render fields in case backend has different structure
    const renderField = (item: any, possibleKeys: string[], fallback: string = '-') => {
        for (const key of possibleKeys) {
            // Support nested like user.username
            if (key.includes('.')) {
                const parts = key.split('.');
                if (item[parts[0]] && item[parts[0]][parts[1]]) {
                    return item[parts[0]][parts[1]];
                }
            } else if (item[key] !== undefined && item[key] !== null) {
                return item[key];
            }
        }
        return fallback;
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="p-6 max-w-7xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Quản lý Mượn/Trả Sách</h2>
                <button onClick={fetchBorrowings} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm transition-colors font-medium">
                    Làm mới danh sách
                </button>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Mã Mượn</th>
                            <th>Email</th>
                            <th>Tên</th>
                            <th>Tên Sách</th>
                            <th>Ngày Mượn</th>
                            <th>Ngày Hạn</th>
                            <th>Ngày Trả</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="text-center py-4">Đang tải dữ liệu...</td></tr>
                        ) : borrowings.length === 0 ? (
                            <tr><td colSpan={7} className="text-center py-4 text-gray-500">Chưa có bản ghi mượn sách nào</td></tr>
                        ) : borrowings.map((item) => (
                            <tr key={item.id}>
                                <td className="font-medium text-center">#{item.id}</td>
                                <td>{renderField(item, ['email', 'user.email', 'userId'])}</td>
                                <td>{renderField(item, ['name', 'user.name', 'userId'])}</td>
                                <td>{renderField(item, ['bookTitle', 'book.title', 'bookId'])}</td>
                                <td className="text-center">{formatDate(renderField(item, ['borrowDate', 'createdAt']))}</td>
                                <td className="text-orange-600">{formatDate(renderField(item, ['dueDate', 'expectedReturnDate']))}</td>
                                <td className="text-green-600 font-medium">
                                    {item.returnDate ? formatDate(item.returnDate) : "-"}
                                </td>
                                <td className="text-center">
                                    {/* Backend status mapping */}
                                    {(() => {
                                        const st = renderField(item, ['status']).toString().toUpperCase();
                                        if (st === 'RETURNED') return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">ĐÃ TRẢ</span>;
                                        if (st === 'LOST') return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">MẤT SÁCH</span>;
                                        if (st === 'BORROWED') return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">ĐANG MƯỢN</span>;
                                        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-bold">{st}</span>;
                                    })()}
                                </td>
                                <td className="text-center">
                                    <div className="flex justify-center gap-2">
                                        {/* Hiển thị nút nếu sách chưa trả/báo mất */}
                                        {renderField(item, ['status']).toString().toUpperCase() !== 'RETURNED' &&
                                            renderField(item, ['status']).toString().toUpperCase() !== 'LOST' && (
                                                <>
                                                    <button
                                                        onClick={() => handleReturnBook(item.id)}
                                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm font-medium transition-colors"
                                                    >
                                                        Đã Trả
                                                    </button>
                                                    <button
                                                        onClick={() => handleReportLost(item.id)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm font-medium transition-colors"
                                                    >
                                                        Báo Mất
                                                    </button>
                                                </>
                                            )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BorrowManager;
