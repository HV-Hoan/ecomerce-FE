import React, { useState, useEffect } from "react";
import ProductFormList from "../components/ProductForm";
import "../css/CategoryForm.css";
import "../css/TopHome.css";

const HomeForm = () => {
    const [topRatedProducts, setTopRatedProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchTopRatedProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/top-rated-products");
            if (!response.ok) {
                throw new Error("Có lỗi xảy ra khi lấy danh sách sản phẩm");
            }
            const data = await response.json();
            setTopRatedProducts(data.products);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopRatedProducts();
    }, []);

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div className="home-container">
            <h2 className="top-rated-title">Sản phẩm được đánh giá tốt nhất</h2>
            <ul className="top-rated-list">
                {topRatedProducts.length > 0 ? (
                    topRatedProducts.map((product) => {
                        const imageSrc = product.image_Product || "/images/default-product.jpg"; // Ảnh mặc định nếu không có ảnh
                        const averageRating = product.averageRating ? parseFloat(product.averageRating).toFixed(1) : "Chưa có";
                        const ratingCount = product.ratingCount || 0;

                        return (
                            <li key={product.id} className="top-rated-item">
                                <div className="product-details">
                                    <img
                                        src={imageSrc}
                                        alt={product.name_Product}
                                        className="product-image"
                                    />
                                    <div className="product-info">
                                        <p className="product-name">{product.name_Product}</p>
                                        <span className="average-rating">⭐ {averageRating}</span>
                                        <span className="rating-count">({ratingCount} lượt đánh giá)</span>
                                    </div>
                                </div>
                            </li>
                        );
                    })
                ) : (
                    <p className="no-products">Không có sản phẩm nào được đánh giá.</p>
                )}
            </ul>

            <h2 className="product-list-title">Danh sách sản phẩm</h2>
            <div>
                <ProductFormList />
            </div>
        </div>
    );
};

export default HomeForm;
