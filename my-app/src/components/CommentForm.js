import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "../css/CommentForm.css";

const CommentForm = ({ id_Product }) => {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {


            } catch (error) {
                console.error("Lỗi khi decode token:", error);
                localStorage.removeItem("token");
            }
        }
    }, []);



    useEffect(() => {
        if (!id_Product) return;
        fetch(`http://localhost:5000/api/comment/${id_Product}`)
            .then((res) => res.json())
            .then((data) => setComments(data.comments || []))
            .catch((err) => console.error("Lỗi khi tải bình luận:", err));
    }, [id_Product]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!comment.trim()) {
            setError("Vui lòng nhập bình luận trước khi gửi!");
            return;
        }
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Lỗi: Chưa đăng nhập");
            return;
        }

        let userId = null;
        try {
            const decoded = jwtDecode(token);
            userId = decoded.id;
        } catch (error) {
            console.error("Lỗi khi decode token:", error);
            localStorage.removeItem("token");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/comment/${id_Product}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ comment, userId }), // Thêm userId vào payload
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Lỗi khi gửi bình luận");
            }
            const result = await response.json();
            setComments([result.comment, ...comments]);
            setComment("");
            window.location.reload();
        } catch (error) {
            console.error("Lỗi:", error.message);
        } finally {
            setLoading(false);
        }
    };




    return (
        <div className="comment-section">
            <h2>Bình luận</h2>
            <form onSubmit={handleSubmit} className="comment-form">
                <textarea
                    value={comment}
                    onChange={(e) => {
                        setComment(e.target.value);
                        setError(""); // ✅ Xóa lỗi khi người dùng bắt đầu nhập
                    }}
                    placeholder="Nhập bình luận..."
                    className="comment-input"
                    disabled={loading}
                ></textarea>

                {error && <p className="error-message">{error}</p>} {/* ✅ Hiển thị lỗi */}

                <button type="submit" className="comment-button" disabled={loading}>
                    {loading ? "Đang gửi..." : "Gửi"}
                </button>
            </form>

            <div className="comment-list">
                {loading ? (
                    <p>Đang tải bình luận...</p>
                ) : comments.length === 0 ? (
                    <p>Chưa có bình luận nào.</p>
                ) : (
                    comments.map((c, index) => (
                        <div key={index} className="comment-item">
                            <div className="comment-header">
                                <img src={c.User?.image_avatar || "/default-avatar.png"} alt="Avatar" className="comment-avatar" />
                                <strong>{c.User?.fullname || "Người dùng ẩn danh"}</strong>
                            </div>
                            <p>{c.comment}</p>
                            <span className="comment-time">
                                {c.createdAt ? new Date(c.createdAt).toLocaleString() : "Không có thời gian"}
                            </span>

                        </div>
                    ))
                )}
            </div>

        </div>
    );
};

export default CommentForm;
