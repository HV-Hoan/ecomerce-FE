import React, { useEffect, useState } from "react";
import "./CategoryForm.css";

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/category");
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

        fetchCategories();
    }, []);

    const toggleCategory = (id) => {
        setExpandedCategories((prevState) =>
            prevState.includes(id)
                ? prevState.filter((categoryId) => categoryId !== id)
                : [...prevState, id]
        );
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
                        key={category.id}
                        className="category-item"
                        onClick={() => toggleCategory(category.id_Category)}
                    >
                        <div className="category-item-header">
                            <span
                                className={`category-arrow ${expandedCategories.includes(category.id_Category) ? "expanded" : ""
                                    }`}
                            >

                            </span>
                            <span className="category-item-name">{category.name_Category}</span>
                        </div>
                        {expandedCategories.includes(category.id_Category) && (
                            <div className="category-dropdown">
                                <p>{category.description_Category}</p>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;
