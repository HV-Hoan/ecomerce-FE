import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/DetailForm.css";
import CommentForm from "./CommentForm";
import RatingStars from "./RatingStars";

const ShowDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        console.log("🛠 productId từ URL:", productId);

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/product/${productId}`);
                if (!response.ok) throw new Error("Có lỗi khi lấy thông tin sản phẩm");

                const data = await response.json();
                console.log("🔍 Dữ liệu sản phẩm từ API:", data);

                if (data.status === 200 && data.product) {
                    setProduct(data.product);
                } else {
                    throw new Error(data.message || "Không thể lấy thông tin sản phẩm");
                }
            } catch (err) {
                console.error("Lỗi:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchRating = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/vote/${productId}`);
                if (!response.ok) throw new Error("Có lỗi khi lấy đánh giá");

                const data = await response.json();
                setRating(data.averageRating || 0);
            } catch (err) {
                console.error("Lỗi lấy đánh giá:", err);
            }
        };

        fetchData();
        fetchRating();
    }, [productId]);

    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("Bạn cần đăng nhập để thêm vào giỏ hàng!");
                return;
            }

            console.log("🛒 Gửi request thêm vào giỏ hàng:", { productId: productId, quantity });

            const response = await fetch(`http://localhost:5000/api/cart/add/${productId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ quantity })
            });

            const data = await response.json();
            setMessage(response.ok ? "🛒 Đã thêm sản phẩm vào giỏ hàng!" : `Lỗi: ${data.message}`);
        } catch (error) {
            console.error("Lỗi server khi thêm vào giỏ hàng:", error);
            setMessage("Lỗi server, vui lòng thử lại!");
        }
    };

    if (error) return <p>Lỗi: {error}</p>;
    if (loading) return <p>Đang tải thông tin sản phẩm...</p>;

    return (
        <div className="detail-container">
            {product ? (
                <div className="product-section">
                    <div className="product-image-detail">
                        <img
                            src={product.image_Product || "https://via.placeholder.com/300"}
                            alt={product.name_Product || "Không có tên sản phẩm"}
                            onError={(e) => { e.target.src = "https://via.placeholder.com/300"; }}
                        />
                    </div>

                    <div className="product-info">
                        <h1>{product.name_Product || "Sản phẩm không có tên"}</h1>
                        <p>{product.description || "Không có mô tả"}</p>
                        <p>Giá: {product.price_Product ? parseInt(product.price_Product).toLocaleString("vi-VN") : "Liên hệ"} VND</p>

                        <div className="product-rating">
                            <span>Đánh giá:</span>
                            <RatingStars currentRating={rating} />
                        </div>

                        <div className="product-detail-item">
                            <span className="detail-label">Trạng thái:</span>
                            <span
                                className="detail-value"
                                style={{ color: product.status_Product === "0" ? "green" : "red", fontWeight: "bold" }}
                            >
                                {product.status_Product === "0" ? "Còn hàng" : "Hết hàng"}
                            </span>
                        </div>

                        <div className="quantity-selector">
                            <label>Số lượng:</label>
                            <input
                                type="number"
                                value={quantity}
                                min="1"
                                max="100"
                                onChange={(e) => {
                                    const newValue = parseInt(e.target.value, 100);
                                    if (!isNaN(newValue) && newValue >= 1 && newValue <= 100) {
                                        setQuantity(newValue);
                                    }
                                }}
                            />
                        </div>

                        <button
                            className={`button-add-cart ${product.status_Product !== "0" ? "disabled" : ""}`}
                            disabled={product.status_Product !== "0"}
                            onClick={handleAddToCart}
                        >
                            Thêm vào giỏ hàng
                        </button>

                        {message && <p className="cart-message">{message}</p>}
                    </div>
                </div>
            ) : (
                <p className="loading-message">Không tìm thấy sản phẩm hoặc đang tải...</p>
            )}

            <div className="additional-section">
                <h1>Nội dung phản hồi</h1>
            </div>
            <CommentForm productId={productId} />
        </div>
    );
};

export default ShowDetail;
