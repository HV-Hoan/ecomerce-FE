import React, { useState, useEffect } from "react";
import "../css/CategoryForm.css";
import "../css/TopHome.css";
import "../css/ListHome.css";

const HomeForm = () => {
    const [topRatedProducts, setTopRatedProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

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

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/product");
            if (!response.ok) {
                throw new Error("Có lỗi xảy ra khi lấy danh sách sản phẩm");
            }
            const data = await response.json();
            setProducts(data.list_Product || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopRatedProducts();
        fetchProducts();
    }, []);

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div className="home-container">
            <h2 className="top-rated-title">Sản phẩm được đánh giá tốt nhất</h2>
            <ul className="top-rated-list">
                {topRatedProducts.map((product) => (
                    <li key={product.id_Product} className="top-rated-item">
                        <div className="product-details">
                            <img
                                src={product.image_Product}
                                alt={product.name_Product}
                                className="product-image"
                            />
                            <div className="product-info">
                                <p>{product.name_Product}</p>
                                <span className="average-rating">
                                    {product.rating
                                        ? `Đánh giá: ${product.rating.toFixed(1)}`
                                        : "Chưa có đánh giá"}
                                </span>
                                <span className="rating-count">
                                    {product.ratingCount
                                        ? `${product.ratingCount} lượt đánh giá`
                                        : "0 lượt đánh giá"}
                                </span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Phần sản phẩm bên dưới */}
            <h2 className="product-list-title">Danh sách sản phẩm</h2>
            <ul className="product-list">
                {products.length > 0 ? (
                    products.map((product) => (
                        <li key={product.id_Product} className="product-item">
                            <div className="product-details">
                                <img
                                    src={product.image_Product}
                                    alt={product.name_Product}
                                    className="product-image"
                                />
                                <div className="product-info">
                                    <p>{product.name_Product}</p>
                                    <div className="product-form-item">
                                        <label className="name-List">Gia tien</label>
                                        <input
                                            type="text"
                                            value={product.price_Product || "Dang cap nhat"}
                                            readOnly
                                        />
                                    </div>
                                    <div className="product-form-item">
                                        <label>Đánh giá</label>
                                        <div className="rating-display">
                                            {/* Hiển thị sao dựa trên rating */}
                                            {Array.from({ length: 5 }, (_, index) => (
                                                <span
                                                    key={index}
                                                    className={product.rating && product.rating >= index + 1 ? "filled-star" : "empty-star"}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                            {/* Hiển thị số lượng đánh giá */}
                                            <span className="rating-number">
                                                ({product.rating ? product.rating.toFixed(1) : "Chưa có đánh giá"})
                                            </span>
                                        </div>
                                    </div>

                                    <div className="product-form-item">
                                        <label className="name-List">Lượt đánh giá</label>
                                        <input
                                            type="text"
                                            value={product.ratingCount ? product.ratingCount : "0 lượt đánh giá"}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>Không có sản phẩm nào</p>
                )}
            </ul>
        </div>
    );
};

export default HomeForm;
