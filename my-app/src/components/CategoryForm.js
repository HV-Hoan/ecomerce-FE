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
    const [showAddCategoryForm, setShowAddCategoryForm] = useState(false); // Thêm state để kiểm tra hiển thị form
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [showEditCategoryForm, setShowEditCategoryForm] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);


    const fetchCategoriesWithProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/category-with-products");
            if (!response.ok) {
                throw new Error("Có lỗi xảy ra khi lấy danh sách");
            }
            const data = await response.json();

            // Gọi API để lấy rating của từng sản phẩm
            const categoriesWithRatings = await Promise.all(
                data.list_Category.map(async (category) => {
                    const productsWithRatings = await Promise.all(
                        category.Products.map(async (product) => {
                            const rating = await fetchVoteForProduct(product.id);
                            return { ...product, rating };
                        })
                    );
                    return { ...category, Products: productsWithRatings };
                })
            );

            setCategories(categoriesWithRatings);
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

    const handleEditCategory = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/api/category/${categoryToEdit.id_Category}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    name_Category: categoryName,
                    description_Category: categoryDescription,
                }),
            });

            if (!response.ok) {
                throw new Error("Có lỗi xảy ra khi cập nhật loại");
            }

            const result = await response.json();
            alert(result.message || "Cập nhật loại thành công!");

            // Cập nhật lại danh sách categories
            fetchCategoriesWithProducts();

            // Đóng form sửa category
            setShowEditCategoryForm(false);
            setCategoryName(""); // Reset các trường
            setCategoryDescription("");
        } catch (error) {
            alert(error.message);
        }
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
                    category.id === categoryId
                        ? {
                            ...category,
                            Products: category.Products.filter(product => product.id !== productId)
                        }
                        : category
                )
            );
            setProductToDelete(null);
        } catch (err) {
            alert(err.message);
        }
    };
    const deleteCategory = async (categoryId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/category/${categoryId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (!response.ok) {
                throw new Error("Có lỗi xảy ra khi xóa loại");
            }

            const result = await response.json();
            alert(result.message || "Xóa loại thành công");

            // Cập nhật lại danh sách categories
            setCategories((prevCategories) =>
                prevCategories.filter((category) => category.id !== categoryId)
            );
        } catch (err) {
            alert(err.message);
        }
    };
    const fetchVoteForProduct = async (productId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/vote/${productId}`);
            if (!response.ok) {
                throw new Error("Lỗi khi lấy đánh giá sản phẩm");
            }
            const data = await response.json();
            return data.averageRating;
        } catch (error) {
            console.error("Lỗi lấy đánh giá:", error);
            return 0;
        }
    };


    const handleRating = async (productId, rating) => {
        try {
            const response = await fetch(`http://localhost:5000/api/vote/${productId}/rate`, {
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

    const addCategory = async (e) => {
        e.preventDefault(); // Ngăn trang reload khi submit
        try {
            const response = await fetch(`http://localhost:5000/api/category`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    name_Category: categoryName,
                    description_Category: categoryDescription,
                }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Có lỗi xảy ra khi thêm loại mới");
            }

            alert(result.message || "Thêm loại thành công!");
            setShowAddCategoryForm(false);
            setCategoryName("");
            setCategoryDescription("");
            fetchCategoriesWithProducts(); // Cập nhật danh sách sau khi thêm
        } catch (error) {
            console.error("Lỗi thêm category:", error);
            alert(error.message);
        }
    };



    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div className="category-container">
            <h1 className="category-title">Danh sách Category</h1>
            {role === "admin" && (
                <button className="add-category-button" onClick={() => setShowAddCategoryForm(true)}>
                    Thêm loại
                </button>
            )}

            {showAddCategoryForm && (
                <div className="add-category-form">
                    <h2>Thêm loại mới</h2>
                    <form onSubmit={addCategory}>
                        <div>
                            <label>Tên loại:</label>
                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Mô tả:</label>
                            <textarea
                                value={categoryDescription}
                                onChange={(e) => setCategoryDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit">Thêm loại</button>
                        <button type="button" onClick={() => setShowAddCategoryForm(false)}>Hủy</button>
                    </form>
                </div>
            )}

            {/* Form Sửa loại */}
            {showEditCategoryForm && categoryToEdit && (
                <div className="edit-category-form">
                    <h2>Sửa loại</h2>
                    <form onSubmit={handleEditCategory}>
                        <div>
                            <label>Tên loại:</label>
                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Mô tả:</label>
                            <textarea
                                value={categoryDescription}
                                onChange={(e) => setCategoryDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit">Cập nhật loại</button>
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => setShowEditCategoryForm(false)}
                        >
                            Hủy
                        </button>
                    </form>
                </div>
            )}

            <ul className="category-list">
                {categories.map((category) => {
                    const totalPages = Math.ceil(category.Products.length / productsPerPage);

                    return (
                        <li key={category.id} className="category-item">

                            <div className="category-item-header" onClick={() => toggleCategory(category.id)}>
                                <span
                                    className={`category-arrow ${expandedCategories.includes(category.id) ? "expanded" : ""}`}
                                >
                                    ►
                                </span>
                                <span className="category-item-name">{category.name_Category}</span>
                                <p className="category-description">{category.description_Category}</p>
                                {/* Button Sửa */}
                                {role === "admin" && (
                                    <div className="category-actions">
                                        <button
                                            className="edit-category-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowEditCategoryForm(true);
                                                setCategoryToEdit(category); // Lưu category hiện tại vào state
                                            }}
                                        >
                                            Sửa
                                        </button>


                                    </div>
                                )}

                                {role === "admin" && (
                                    <button
                                        className="delete-category-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm("Bạn có chắc chắn muốn xóa loại này không?")) {
                                                deleteCategory(category.id);
                                            }
                                        }}
                                    >
                                        Xóa
                                    </button>
                                )}
                            </div>

                            {expandedCategories.includes(category.id) && (
                                <div className="category-dropdown">
                                    <ul className="product-list">
                                        {paginate(category).map(product => (
                                            <li key={product.id} className="product-item">
                                                <div className="product-details">
                                                    <img src={product.image_Product} alt="" className="product-image" />
                                                    <div className="product-info">
                                                        <p>{product.name_Product}</p>
                                                        {role === 'user' && (
                                                            <div className="rating-container">
                                                                <RatingStars
                                                                    currentRating={product.rating} // Nhận rating từ API
                                                                    onRate={(rating) => handleRating(product.id, rating)}
                                                                />

                                                            </div>
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
                                                                confirmDelete(product.id, category.id);
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