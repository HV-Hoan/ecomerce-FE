import { useLocation } from "react-router-dom";

const Order = () => {
    const location = useLocation();
    const selectedProducts = location.state?.selectedProducts || [];

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">🛒 Xác nhận Đơn Hàng</h2>
            {selectedProducts.length === 0 ? (
                <p className="text-center text-gray-500">Không có sản phẩm nào được chọn!</p>
            ) : (
                <div>
                    {selectedProducts.map((item) => (
                        <div key={item.id_Product} className="flex items-center border-b p-3">
                            <img src={item.Product.image_Product} alt={item.Product.name_Product} className="w-16 h-16 object-cover rounded mr-4" />
                            <div>
                                <p className="font-semibold">{item.Product.name_Product}</p>
                                <p>Giá: {item.Product.price_Product.toLocaleString()} đ</p>
                                <p>Số lượng: {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                    <h3 className="text-xl font-bold mt-4">
                        Tổng tiền: {selectedProducts.reduce((total, item) => total + item.quantity * item.Product.price_Product, 0).toLocaleString()} đ
                    </h3>
                    <button className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
                        ✅ Xác nhận đặt hàng
                    </button>
                    <button className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
                        X Hủy đơn hàng
                    </button>
                </div>
            )}
        </div>
    );
};

export default Order;
