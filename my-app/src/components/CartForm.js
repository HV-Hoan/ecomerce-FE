import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Cart.css"
import axios from "axios";

const Cart = ({ userId }) => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set());


    const fetchCart = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/cart/get/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setCartItems(response.data.cartItems);
            setSelectedItems(new Set(response.data.cartItems.map(item => item.id_Product)));
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
        }
    }, [userId]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const toggleSelection = (productId) => {
        setSelectedItems(prevSelected => {
            const updatedSelection = new Set(prevSelected);
            updatedSelection.has(productId) ? updatedSelection.delete(productId) : updatedSelection.add(productId);
            return updatedSelection;
        });
    };

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await axios.put(`http://localhost:5000/api/cart/update/${productId}`, { quantity: newQuantity }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            fetchCart();
        } catch (error) {
            console.error("Lỗi khi cập nhật số lượng:", error);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            fetchCart();
        } catch (error) {
            console.error("Lỗi khi xoá sản phẩm:", error);
        }
    };
    const navigate = useNavigate();

    const handleCheckout = () => {
        const selectedProducts = cartItems.filter(item => selectedItems.has(item.id_Product));
        if (selectedProducts.length === 0) {
            alert("Vui lòng chọn ít nhất một sản phẩm để đặt hàng!");
            return;
        }
        navigate("/confirm", { state: { selectedProducts } }); // Điều hướng sang trang Order
    };


    const totalPrice = cartItems.reduce((total, item) => {
        return selectedItems.has(item.id_Product) ? total + item.quantity * item.Product.price_Product : total;
    }, 0);

    return (
        <div className="cart-container">
            <h2 className="cart-title">🛒 Giỏ Hàng</h2>
            {cartItems.length === 0 ? (
                <p className="text-center text-gray-500">Giỏ hàng trống.</p>
            ) : (
                <div>
                    {cartItems.map((item) => (
                        <div key={item.id_Product} className="cart-item">
                            <input
                                type="checkbox"
                                checked={selectedItems.has(item.id_Product)}
                                onChange={() => toggleSelection(item.id_Product)}
                                className="cart-checkbox"
                            />
                            <img
                                src={item.Product.image_Product}
                                alt={item.Product.name_Product}
                                className="cart-image"
                            />
                            <div className="cart-info">
                                <p className="cart-name">{item.Product.name_Product}</p>
                                <p className="cart-price">{item.Product.price_Product.toLocaleString()} đ</p>
                                <div className="cart-quantity">
                                    <button onClick={() => handleQuantityChange(item.id_Product, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleQuantityChange(item.id_Product, item.quantity + 1)}>+</button>
                                </div>
                            </div>
                            <button className="cart-remove" onClick={() => handleRemove(item.id_Product)}>🗑</button>
                        </div>
                    ))}
                    <h3 className="cart-total">Tổng tiền: {totalPrice.toLocaleString()} đ</h3>
                    {cartItems.length > 0 && (
                        <button
                            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                            onClick={handleCheckout}
                        >
                            🚀 Tiến hành đặt hàng
                        </button>
                    )}

                </div>
            )}
        </div>

    );
};

export default Cart;
