import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import RatingStars from "./RatingStars";
import "../css/ListHome.css";

const ProductFormList = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]); // Khai báo state cho products
    const [role, setRole] = useState(""); // Lưu role người dùng
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false); // Trạng thái kiểm tra xem có đang xóa hay không

    const fetchRole = () => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = jwtDecode(token); // Giải mã token để lấy role
            setRole(decodedToken.role); // Lưu role vào state
        }
    };

    useEffect(() => {
        fetchRole();
        fetchProducts();
    }, []);

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

    const deleteProduct = async (productId) => {

        try {
            const response = await fetch(`http://localhost:5000/api/product/${productId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            if (!response.ok) {
                throw new Error("Có lỗi xảy ra khi xóa sản phẩm");
            }

            const result = await response.json();
            alert(result.message || "Xóa sản phẩm thành công");

            // Reload lại danh sách sản phẩm sau khi xóa
            fetchProducts();
            window.location.reload();

            // Reset trạng thái productToDelete và isDeleting
            setProductToDelete(null);  // Đảm bảo reset lại trạng thái productToDelete
        } catch (err) {
            alert(err.message);
        } finally {
            setIsDeleting(false); // Đảm bảo trạng thái isDeleting được reset sau khi hoàn thành
        }
    };

    const confirmDelete = (productId) => {
        // Đặt trạng thái productToDelete ngay khi người dùng nhấn nút xác nhận xóa
        setProductToDelete(productId);
    };

    const handleRating = async (productId, rating) => {
        if (role !== "user") {
            alert("Chỉ người dùng mới có thể đánh giá");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/product/${productId}/rate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ rating }),
            });
            const data = await response.json();
            if (response.ok) {
                // Cập nhật điểm đánh giá của sản phẩm
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.id_Product === productId
                            ? { ...product, rating: data.rating }
                            : product
                    )
                );
                alert("Đánh giá thành công");
            } else {
                alert(data.message || "Đã xảy ra lỗi khi gửi đánh giá");
            }
        } catch (error) {
            alert("Có lỗi xảy ra khi đánh giá");
        }
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <ul className="product-list">
            {products.length > 0 ? (
                products.map((product) => (
                    <li key={product.id_Product} className="product-item">
                        <div className="product-details">
                            <img src={product.image_Product} alt="" className="product-image" />
                            <div className="product-info">
                                <p>{product.name_Product}</p>
                                {role === 'user' && (
                                    <RatingStars
                                        currentRating={product.rating || 0}
                                        onRate={(rating) => handleRating(product.id_Product, rating)}
                                    />
                                )}

                                <span className="average-rating">
                                    {product.rating ? `(${product.rating.toFixed(1)})` : "(0.0)"}
                                </span>
                            </div>
                            {role === "admin" && (
                                <button
                                    className="delete-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        confirmDelete(product.id_Product);  // Đảm bảo productId được truyền
                                    }}
                                >
                                    X
                                </button>
                            )}
                        </div>

                        {/* Modal xác nhận xóa */}
                        {productToDelete === product.id_Product && (
                            <div className="delete-confirm-modal">
                                <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
                                <button
                                    onClick={() => deleteProduct(product.id_Product)}
                                    className="confirm-delete-button"
                                    disabled={isDeleting}  // Disable nút khi đang xóa
                                >
                                    Xác nhận
                                </button>

                                <button onClick={() => setProductToDelete(null)} className="cancel-delete-button">
                                    Hủy
                                </button>
                            </div>
                        )}

                    </li>
                ))
            ) : (
                <p>Không có sản phẩm nào</p>
            )}
        </ul>
    );
};

export default ProductFormList;
