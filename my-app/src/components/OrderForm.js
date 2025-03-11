import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Order = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedProducts = location.state?.selectedProducts || [];
    const [loading, setLoading] = useState(false);

    const [paymentMethods, setPaymentMethods] = useState(
        selectedProducts.reduce((acc, item) => {
            acc[item.productId] = "0"; // Mặc định là tiền mặt (0)
            return acc;
        }, {})
    );

    const handlePaymentChange = (productId, method) => {
        setPaymentMethods((prev) => ({
            ...prev,
            [productId]: method
        }));
    };

    const handleConfirmOrder = async () => {
        setLoading(true);
        try {
            const userId = 1; // Lấy userId từ session hoặc context
            const totalPrice = selectedProducts.reduce(
                (total, item) => total + item.quantity * item.Product.price_Product,
                0
            );
            const totalQuantity = selectedProducts.reduce((sum, item) => sum + item.quantity, 0);

            // Gửi đơn hàng lên API
            const response = await axios.post("http://localhost:5000/api/order/create", {
                userId,
                price: totalPrice,
                quantity: totalQuantity,
                status_Order: "0",
                payment_method: paymentMethods[selectedProducts[0]?.productId] || "0",
                payment_status: "0",
                products: selectedProducts.map((item) => ({
                    id: item.productId,
                    quantity: item.quantity
                }))
            });

            alert(response.data.message);
            navigate("/user/home");
        } catch (error) {
            console.error("Lỗi khi đặt hàng:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">🛒 Xác nhận Đơn Hàng</h2>
            {selectedProducts.length === 0 ? (
                <p className="text-center text-gray-500">Không có sản phẩm nào được chọn!</p>
            ) : (
                <div>
                    {selectedProducts.map((item) => (
                        <div key={item.productId} className="flex items-center border-b p-3">
                            <img
                                src={item.Product.image_Product}
                                alt={item.Product.name_Product}
                                className="w-16 h-16 object-cover rounded mr-4"
                            />
                            <div>
                                <p className="font-semibold">{item.Product.name_Product}</p>
                                <p>Giá: {item.Product.price_Product.toLocaleString()} đ</p>
                                <p>Số lượng: {item.quantity}</p>
                                <p>Phương thức thanh toán:</p>
                                <select
                                    value={paymentMethods[item.productId]}
                                    onChange={(e) => handlePaymentChange(item.productId, e.target.value)}
                                    className="border p-2 rounded-md"
                                >
                                    <option value="0">Tiền mặt</option>
                                    <option value="1">Chuyển khoản</option>
                                </select>
                            </div>
                        </div>
                    ))}
                    <h3 className="text-xl font-bold mt-4">
                        Tổng tiền:{" "}
                        {selectedProducts
                            .reduce((total, item) => total + item.quantity * item.Product.price_Product, 0)
                            .toLocaleString()}{" "}
                        đ
                    </h3>
                    <button
                        onClick={handleConfirmOrder}
                        disabled={loading}
                        className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                    >
                        {loading ? "⏳ Đang xử lý..." : "✅ Xác nhận đặt hàng"}
                    </button>
                    <button
                        className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                        onClick={() => navigate("/user/home")}
                    >
                        ❌ Hủy đơn hàng
                    </button>
                </div>
            )}
        </div>
    );
};

export default Order;
