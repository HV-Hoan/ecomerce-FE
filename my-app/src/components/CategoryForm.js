import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "../css/CategoryForm.css";

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [role, setRole] = useState(""); // Thêm state để lưu role

    // Lấy danh sách category kèm theo sản phẩm
    useEffect(() => {
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
        setExpandedCategories((prevState) =>
            prevState.includes(id)
                ? prevState.filter((id_Category) => id_Category !== id)
                : [...prevState, id]
        );
    };

    const deleteProduct = async (productId, categoryId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/product/${productId}/${categoryId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } // Gửi token nếu cần xác thực
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
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) {
        return <p>Đang tải dữ liệu...</p>;
    }

    if (error) {
        return <p>Lỗi: {error}</p>;
    }

    return (
        <div className="category-container">
            <h1 className="category-title">Danh sách Category</h1>
            <ul className="category-list">
                {categories.map((category) => (
                    <li
                        key={category.id_Category}
                        className="category-item"
                        onClick={() => toggleCategory(category.id_Category)}
                    >
                        <div className="category-item-header">
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
                                    {category.Products?.map(product => (
                                        <li key={product.id_Product} className="product-item">
                                            <div className="product-details">
                                                <img
                                                    src={product.image_Product}
                                                    alt=""
                                                    className="product-image"
                                                />
                                                <div className="product-info">
                                                    <p>{product.name_Product}</p>
                                                </div>
                                                {/* Hiển thị nút delete nếu role là admin */}
                                                {role === "admin" && (
                                                    <button
                                                        className="delete-button align-right"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Ngăn chặn việc mở/đóng category
                                                            deleteProduct(product.id_Product, category.id_Category);
                                                        }}
                                                    >
                                                        ❌
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;
