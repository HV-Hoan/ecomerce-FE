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
    const [productToUpdate, setProductToUpdate] = useState(null); // Khai báo state để lưu ID sản phẩm cần chỉnh sửa

    const [updateData, setUpdateData] = useState({
        name_Product: "",
        price_Product: "",
        description: "",
        status_Product: "",
        image_Product: null,
    });

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


    const handleOpenUpdateModal = (product) => {
        setProductToUpdate(product.id_Product);
        setUpdateData({
            name_Product: product.name_Product,
            price_Product: product.price_Product,
            description: product.description,
            status_Product: product.status_Product,
            image_Product: null,
        });
    };

    const handleUpdateChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image_Product") {
            setUpdateData((prevData) => ({ ...prevData, [name]: files[0] }));
        } else {
            setUpdateData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const updateProduct = async () => {
        const formData = new FormData();
        formData.append("name_Product", updateData.name_Product);
        formData.append("price_Product", updateData.price_Product);
        formData.append("description", updateData.description);
        formData.append("status_Product", updateData.status_Product);
        if (updateData.image_Product) {
            formData.append("image_Product", updateData.image_Product);
        }

        try {
            const response = await fetch(`http://localhost:5000/api/product/${productToUpdate}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error response:", errorData);
                throw new Error(errorData.message || "Có lỗi xảy ra khi cập nhật sản phẩm");
            }

            alert("Cập nhật sản phẩm thành công");
            setProductToUpdate(null);
            fetchProducts(); // Reload danh sách sản phẩm sau khi cập nhật
        } catch (error) {
            console.error("Error updating product:", error.message);
            alert(error.message);
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
                                <p>{product.price_Product}</p>
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
                            <div className="product-action-buttons">
                                {role === "admin" && (
                                    <button
                                        className="update-product-button"
                                        onClick={() => handleOpenUpdateModal(product)}
                                    >
                                        ⏫
                                    </button>
                                )}


                                {role === "admin" && (
                                    <button
                                        className="delete-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            confirmDelete(product.id_Product);  // Đảm bảo productId được truyền
                                        }}
                                    >
                                        x
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Modal xác nhận xóa */}
                        {productToDelete === product.id_Product && (
                            <div className="delete-confirm-modal-backdrop">
                                <div className="delete-confirm-modal">
                                    <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
                                    <div className="button-container">
                                        <button
                                            onClick={() => deleteProduct(product.id_Product)}
                                            className="confirm-delete-button"
                                            disabled={isDeleting}
                                        >
                                            Xác nhận
                                        </button>
                                        <button
                                            onClick={() => setProductToDelete(null)}
                                            className="cancel-delete-button"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal cập nhật sản phẩm */}
                        {productToUpdate && (
                            <div className="update-product-modal-backdrop">
                                <div className="update-product-modal">
                                    <h3 className="update-product-modal-title">Cập nhật thông tin sản phẩm</h3>
                                    <form className="update-product-form">
                                        <label className="update-product-label">
                                            Tên sản phẩm:
                                            <input
                                                type="text"
                                                name="name_Product"
                                                className="update-product-input"
                                                value={updateData.name_Product}
                                                onChange={handleUpdateChange}
                                            />
                                        </label>
                                        <label className="update-product-label">
                                            Giá sản phẩm:
                                            <input
                                                type="number"
                                                name="price_Product"
                                                className="update-product-input"
                                                value={updateData.price_Product}
                                                onChange={handleUpdateChange}
                                            />
                                        </label>
                                        <label className="update-product-label">
                                            Mô tả:
                                            <textarea
                                                name="description"
                                                className="update-product-textarea"
                                                value={updateData.description}
                                                onChange={handleUpdateChange}
                                            />
                                        </label>
                                        <label className="update-product-label">
                                            Trạng thái sản phẩm:
                                            <select
                                                name="status_Product"
                                                className="update-product-select"
                                                value={updateData.status_Product}
                                                onChange={handleUpdateChange}
                                            >
                                                <option value="available">Còn hàng</option>
                                                <option value="out_of_stock">Hết hàng</option>
                                            </select>
                                        </label>
                                        <label className="update-product-label">
                                            Hình ảnh:
                                            <input
                                                type="file"
                                                name="image_Product"
                                                className="update-product-file-input"
                                                accept="image/*"
                                                onChange={handleUpdateChange}
                                            />
                                        </label>
                                        <div className="update-product-button-container">
                                            <button
                                                type="button"
                                                className="update-product-submit-button"
                                                onClick={updateProduct}
                                            >
                                                Cập nhật
                                            </button>
                                            <button
                                                type="button"
                                                className="update-product-cancel-button"
                                                onClick={() => setProductToUpdate(null)}
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}




                    </li>
                ))
            ) : (
                <p>Không có sản phẩm nào</p>
            )}
        </ul >
    );
};

export default ProductFormList;
