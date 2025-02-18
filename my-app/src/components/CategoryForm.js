import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import RatingStars from "./RatingStars";
import "../css/CategoryForm.css";

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [role, setRole] = useState(""); // Thêm state để lưu role
    const [productToDelete, setProductToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
    const [productsPerPage] = useState(3);

    const fetchCategoriesWithProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/category-with-products");
            if (!response.ok) {
                throw new Error("Có lỗi xảy ra khi lấy danh sách");
            }
            const data = await response.json();
            setCategories(data.list_Category);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoriesWithProducts();
    }, []);

    useEffect(() => {
        const fetchRole = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const decodedToken = jwtDecode(token); // Decode token để lấy thông tin role
                    setRole(decodedToken.role); // Lưu role vào state
                } catch (err) {
                    console.error("Lỗi khi decode token:", err);
                }
            }
        };
        fetchRole();
    }, []);

    const toggleCategory = (id) => {
        setExpandedCategories((prevState) => {
            if (prevState.includes(id)) {
                return prevState.filter((id_Category) => id_Category !== id);
            } else {
                return [...prevState, id];
            }
        });
    };

    const deleteProduct = async (productId, categoryId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/product/${productId}/${categoryId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (!response.ok) {
                throw new Error("Có lỗi xảy ra khi xóa sản phẩm");
            }

            const result = await response.json();
            alert(result.message || "Xóa sản phẩm thành công");

            // cập nhật lại danh sách sản phẩm sau khi xóa
            setCategories(prevCategories =>
                prevCategories.map(category =>
                    category.id_Category === categoryId
                        ? {
                            ...category,
                            Products: category.Products.filter(product => product.id_Product !== productId)
                        }
                        : category
                )
            );
            setProductToDelete(null);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleRating = async (productId, rating) => {
        try {
            const response = await fetch(`http://localhost:5000/api/product/${productId}/rate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating }),
            });

            if (!response.ok) {
                throw new Error("Có lỗi xảy ra khi đánh giá sản phẩm");
            }

            alert("Đánh giá thành công");

            fetchCategoriesWithProducts();
        } catch (err) {
            alert(err.message);
        }
    };

    const confirmDelete = (productId, categoryId) => {
        setProductToDelete({ productId, categoryId });
    };


    // Hàm phân trang sản phẩm
    const paginate = (category) => {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        return category.Products.slice(startIndex, endIndex);
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div className="category-container">
            <button className="add-category-button" onClick={() => alert("Thêm danh mục mới!")}>
                Them loai
            </button>


            <h1 className="category-title">Danh sách Category</h1>
            <ul className="category-list">
                {categories.map((category) => {
                    const totalPages = Math.ceil(category.Products.length / productsPerPage);

                    return (

                        <li key={category.id_Category} className="category-item">
                            <div
                                className="category-item-header"
                                onClick={() => toggleCategory(category.id_Category)}
                            >
                                <span
                                    className={`category-arrow ${expandedCategories.includes(category.id_Category) ? "expanded" : ""}`}
                                >
                                    ►
                                </span>
                                <span className="category-item-name">{category.name_Category}</span>
                                <p className="category-description">{category.description_Category}</p>
                            </div>
                            {expandedCategories.includes(category.id_Category) && (
                                <div className="category-dropdown">
                                    <ul className="product-list">
                                        {paginate(category).map(product => (
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
                                                                confirmDelete(product.id_Product, category.id_Category);
                                                            }}
                                                        >
                                                            X
                                                        </button>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Nút phân trang */}
                                    <div className="pagination">
                                        {totalPages > 1 && // Chỉ hiển thị phân trang nếu có nhiều hơn 1 trang
                                            Array.from({ length: totalPages }, (_, index) => (
                                                <button
                                                    key={index + 1}
                                                    onClick={() => setCurrentPage(index + 1)}
                                                    className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                    </div>

                                    {/* Modal xác nhận xóa */}
                                    {productToDelete && (
                                        <div className="delete-confirm-modal">
                                            <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
                                            <button
                                                onClick={() => deleteProduct(productToDelete.productId, productToDelete.categoryId)}
                                                className="confirm-delete-button"
                                            >
                                                Xác nhận
                                            </button>
                                            <button onClick={() => setProductToDelete(null)} className="cancel-delete-button">
                                                Hủy
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default CategoryList;
