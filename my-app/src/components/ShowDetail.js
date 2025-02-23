import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/DetailForm.css";
import CommentForm from "./CommentForm";
import RatingStars from "./RatingStars"; // Import component hiển thị sao

const ShowDetail = () => {
    const { id_Product } = useParams();
    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(0); // Lưu điểm đánh giá trung bình
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/product/${id_Product}`);
                if (!response.ok) throw new Error("Có lỗi xảy ra khi lấy thông tin sản phẩm");
                const data = await response.json();
                setProduct(data.findbyID);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchRating = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/vote/${id_Product}`);
                if (!response.ok) throw new Error("Không thể lấy đánh giá sản phẩm");
                const data = await response.json();
                setRating(data.averageRating || 0); // Lưu số sao trung bình
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchProduct();
        fetchRating();
    }, [id_Product]);

    if (error) return <p>Lỗi: {error}</p>;
    if (loading) return <p>Đang tải thông tin sản phẩm...</p>;

    return (
        <div className="detail-container">
            {product && (
                <div className="product-section">
                    <div className="product-image-detail">
                        <img src={product.image_Product} alt={product.name_Product} />
                    </div>
                    <div className="product-info">
                        <h1>{product.name_Product}</h1>
                        <p>{product.description}</p>
                        <p>Giá: {product.price_Product} VND</p>

                        {/* Hiển thị số sao đánh giá */}
                        <div className="product-rating">
                            <span>Đánh giá:</span>
                            <RatingStars currentRating={rating} />
                        </div>

                        <div className="product-detail-item">
                            <span className="detail-label">Trạng thái:</span>
                            <span className="detail-value">
                                {product.status_Product === "0" ? "Còn hàng" : "Hết hàng"}
                            </span>
                        </div>

                        <button
                            className={`button-add-cart ${product.status_Product !== "0" ? "disabled" : ""}`}
                            disabled={product.status_Product !== "0"}
                        >
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            )}

            <div className="additional-section">
                <h1>Nội dung phản hồi</h1>
            </div>
            <CommentForm id_Product={id_Product} />
        </div>
    );
};

export default ShowDetail;
