import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/DetailForm.css";
import CommentForm from "./CommentForm";
import RatingStars from "./RatingStars";

const ShowDetail = () => {
    const { id_Product } = useParams();
    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, ratingRes] = await Promise.all([
                    fetch(`http://localhost:5000/api/product/${id_Product}`),
                    fetch(`http://localhost:5000/api/vote/${id_Product}`)
                ]);

                if (!productRes.ok) throw new Error("Có lỗi khi lấy thông tin sản phẩm");
                if (!ratingRes.ok) throw new Error("Không thể lấy đánh giá sản phẩm");

                const productData = await productRes.json();
                const ratingData = await ratingRes.json();

                setProduct(productData.findbyID);
                setRating(ratingData.averageRating || 0);
            } catch (err) {
                console.error("Lỗi:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id_Product]);

    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("❌ Bạn cần đăng nhập để thêm vào giỏ hàng!");
                return;
            }

            console.log("🛒 Gửi request thêm vào giỏ hàng:", { productId: id_Product, quantity });

            const response = await fetch(`http://localhost:5000/api/cart/add/${id_Product}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ quantity }) // Không cần gửi userId
            });

            const data = await response.json();
            setMessage(response.ok ? "🛒 Đã thêm sản phẩm vào giỏ hàng!" : `❌ Lỗi: ${data.message}`);
        } catch (error) {
            console.error("❌ Lỗi server khi thêm vào giỏ hàng:", error);
            setMessage("❌ Lỗi server, vui lòng thử lại!");
        }
    };




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

                        <div className="quantity-selector">
                            <label>Số lượng:</label>
                            <input
                                type="number"
                                value={quantity}
                                min="1"
                                max="10"
                                onChange={(e) => {
                                    const newValue = parseInt(e.target.value, 10);
                                    if (!isNaN(newValue) && newValue >= 1 && newValue <= 10) {
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
            )}

            <div className="additional-section">
                <h1>Nội dung phản hồi</h1>
            </div>
            <CommentForm id_Product={id_Product} />
        </div>
    );
};

export default ShowDetail;
