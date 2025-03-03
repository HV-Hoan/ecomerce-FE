import React, { useState, useEffect } from "react";
import "../css/ProductForm.css";
import ProductForm from "../components/ProductForm";

const ProductPage = () => {
    const [formData, setFormData] = useState({
        name_Product: "",
        description: "",
        price_Product: "",
        id_Category: [],
        image_Product: null
    });
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false); // Thêm trạng thái hiển thị form

    // Lấy danh sách danh mục từ API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/category-with-products");
                const result = await response.json();
                if (response.ok) {
                    setCategories(result.list_Category);
                } else {
                    console.error("Lỗi khi lấy danh mục:", result.error);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh mục:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image_Product: e.target.files[0] });
    };

    const handleCategoryChange = (e) => {
        const selectedCategories = Array.from(e.target.selectedOptions).map(option => option.value);
        console.log("Danh mục đã chọn:", selectedCategories); // Kiểm tra danh mục chọn
        setFormData({ ...formData, id_Category: selectedCategories });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Dữ liệu gửi lên API:", formData); // Kiểm tra dữ liệu trước khi gửi

        const data = new FormData();
        data.append("name_Product", formData.name_Product);
        data.append("description", formData.description);
        data.append("price_Product", formData.price_Product);
        data.append("image_Product", formData.image_Product);

        formData.id_Category.forEach((categoryId) => {
            data.append("categoryId[]", categoryId); // Kiểm tra tên key
        });

        try {
            const response = await fetch("http://localhost:5000/api/product", {
                method: "POST",
                body: data
            });

            const result = await response.json();
            console.log("Kết quả API:", result); // Kiểm tra phản hồi từ server

            if (response.ok) {
                alert("Thêm sản phẩm thành công!");
                setFormData({
                    name_Product: "",
                    description: "",
                    price_Product: "",
                    id_Category: [],
                    image_Product: null
                });
                window.location.reload();
            } else {
                alert(`Lỗi: ${result.error}`);
            }
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm:", error);
        }
    };


    return (
        <div>
            <h1>Danh sách sản phẩm hiện có</h1>
            <button
                className="toggle-form-btn"
                onClick={() => setShowForm(!showForm)}
            >
                {showForm ? "Đóng form" : "Thêm sản phẩm"}
            </button>


            {showForm && (
                <form onSubmit={handleSubmit} className="product-form">
                    <input
                        type="text"
                        name="name_Product"
                        placeholder="Tên sản phẩm"
                        value={formData.name_Product}
                        onChange={handleInputChange}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Mô tả"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="number"
                        name="price_Product"
                        placeholder="Giá sản phẩm"
                        value={formData.price_Product}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="file"
                        name="image_Product"
                        onChange={handleFileChange}
                    />
                    <label>Chọn danh mục:</label>
                    <select multiple value={formData.id_Category} onChange={handleCategoryChange}>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name_Category}
                            </option>
                        ))}
                    </select>



                    <button type="submit" className="confirm-btn">Thêm sản phẩm</button>
                </form>
            )}
            <ProductForm />
        </div>
    );
};

export default ProductPage;
