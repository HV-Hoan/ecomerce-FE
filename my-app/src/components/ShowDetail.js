import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/DetailForm.css";

const ShowDetail = () => {
    const { id_Product } = useParams();
    const [product, setProduct] = useState(null);
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
        fetchProduct();
    }, [id_Product]);

    if (error) return <p>Lỗi: {error}</p>;
    if (loading) return <p>Đang tải thông tin sản phẩm...</p>;

    return (
        <div className="detail-container">
            <div className="product-section">
                <div className="product-image-detail">
                    <img src={product.image_Product} alt={product.name_Product} />
                </div>


                <div className="product-info">
                    <h1>{product.name_Product}</h1>
                    <form className="product-details-form">
                        <div className="product-detail-item">
                            <span className="detail-label">Mô tả:</span>
                            <span className="detail-value">{product.description}</span>
                        </div>
                        <div className="product-detail-item">
                            <span className="detail-label">Giá:</span>
                            <span className="detail-value">{product.price_Product} VND</span>
                        </div>
                        <div className="product-detail-item">
                            <span className="detail-label">Trạng thái:</span>
                            <span className="detail-value">{product.status_Product === "0" ? "Còn hàng" : "Hết hàng"}</span>
                        </div>
                    </form>

                </div>



            </div>
            <div className="additional-section">
                {/* Nội dung khác sẽ được đặt ở đây */}
            </div>
        </div>
    );
};

export default ShowDetail;
