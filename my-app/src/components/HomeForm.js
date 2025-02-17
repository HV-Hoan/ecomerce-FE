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
            if (!response) {
                throw new Error("Co loi xay ra khi lay danh sach san pham");
            }
            const data = await response.json();
            setProducts(data.list_Product || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTopRatedProducts();
        fetchProducts();
    }, []);

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div className="home-container">
            <h2 className="top-rated-title">Sản phẩm được đánh giá nhiều nhất</h2>
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
            <div className="product-list">
                {/* Danh sách sản phẩm khác có thể hiển thị ở đây */}
                <div className="product-list-container">
                    <h2 className="product-list-title">Danh sách sản phẩm</h2>
                    <table className="product-list-table">
                        <thead>
                            <tr>
                                <th>Tên sản phẩm</th>
                                <th>Ảnh sản phẩm</th>
                                <th>Mô tả</th>
                                <th>Trạng thái</th>
                                <th>Đánh giá</th>
                                <th>Lượt đánh giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.id_Product}>
                                        <td>{product.name_Product}</td>
                                        <td>
                                            {product.image_Product ? (
                                                <img
                                                    src={product.image_Product}
                                                    alt={product.name_Product}
                                                    style={{ width: 50, height: 50 }}
                                                />
                                            ) : (
                                                <span>Không có ảnh</span>
                                            )}
                                        </td>
                                        <td>{product.description || "Chưa có mô tả"}</td>
                                        <td>{product.status_Product === "0" ? "Còn hàng" : "Hết hàng"}</td>
                                        <td>{product.rating ? product.rating.toFixed(1) : "Chưa có đánh giá"}</td>
                                        <td>{product.ratingCount ? product.ratingCount : "0 lượt đánh giá"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">Không có sản phẩm nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HomeForm;
