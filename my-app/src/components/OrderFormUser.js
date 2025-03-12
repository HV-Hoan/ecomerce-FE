import { useEffect, useState } from "react";
import "../css/orderuser.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const OrderList2 = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Bạn chưa đăng nhập!");
                setLoading(false);
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;

                const response = await axios.get(`http://localhost:5000/api/order/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data && response.data.orders) {
                    setOrders(response.data.orders);
                } else {
                    setOrders([]);
                    setError("Không có đơn hàng nào!");
                }
            } catch (err) {
                console.error("Lỗi khi lấy danh sách đơn hàng:", err);
                setError("Không thể tải danh sách đơn hàng!");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);


    const fetchOrderDetails = async (orderId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Bạn chưa đăng nhập!");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/api/order/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedOrder(response.data);
            setShowModal(true);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
            setError("Không thể tải chi tiết đơn hàng!");
        }
    };


    const closeModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    if (loading) return <p className="text-center text-gray-500">Đang tải đơn hàng...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Danh Sách Đơn Hàng</h2>
            {orders.length === 0 ? (
                <p className="text-gray-500 text-center">Không có đơn hàng nào.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="border p-4 rounded-lg shadow-md bg-white">
                            <p className="text-lg font-semibold text-blue-600">Mã đơn hàng: {order.id}</p>
                            <p className="text-gray-700"><strong>Tổng tiền:</strong> {order.price.toLocaleString()} đ</p>
                            <p className="text-gray-700">
                                <strong>Trạng thái:</strong>{" "}
                                <span className={
                                    order.status_Order === "0" ? "text-yellow-500"
                                        : order.status_Order === "1" ? "text-green-500"
                                            : "text-red-500"
                                }>
                                    {order.status_Order === "0" ? "Chờ duyệt"
                                        : order.status_Order === "1" ? "Hoàn thành"
                                            : "Hủy"}
                                </span>
                            </p>
                            <p className="text-gray-700">
                                <strong>Phương thức thanh toán:</strong> {order.payment_method === "0" ? "Tiền mặt" : "Chuyển khoản"}
                            </p>
                            <p className="text-gray-700">
                                <strong>Thanh toán:</strong>{" "}
                                {order.payment_status === "0" ? "Đang xử lý"
                                    : order.payment_status === "1" ? "Đã thanh toán"
                                        : "Đã hủy"}
                            </p>
                            <button
                                onClick={() => fetchOrderDetails(order.id)}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                            >
                                Xem chi tiết
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL Chi tiết đơn hàng */}
            {showModal && selectedOrder && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4 text-center">Chi tiết đơn hàng</h2>
                        <p className="text-gray-700"><strong>Mã đơn hàng:</strong> {selectedOrder.id}</p>
                        <p className="text-gray-700"><strong>Người mua:</strong> {selectedOrder.User?.fullname || "Không có dữ liệu"}</p>
                        <p className="text-gray-700"><strong>Địa chỉ:</strong> {selectedOrder.User?.address || "Không có dữ liệu"}</p>
                        <p className="text-gray-700"><strong>Tổng tiền:</strong> {selectedOrder.price.toLocaleString()} đ</p>
                        <div className="mt-4">
                            <p className="font-bold"> Sản phẩm:</p>
                            <div className="grid grid-cols-1 gap-2">
                                {selectedOrder.OrderDetails.length > 0 ? (
                                    selectedOrder.OrderDetails.map((item) => (
                                        <div key={item.Product.id} className="flex items-center space-x-4 border p-2 rounded-md">
                                            <img
                                                src={item.Product.image_product}
                                                alt={item.Product.name_product}
                                                className="product-image"
                                            />


                                            <div>
                                                <p className="text-gray-800 font-semibold">{item.Product.name_product}</p>
                                                <p className="text-gray-600">Số lượng: <span className="font-bold">{item.quantity}</span></p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">Không có sản phẩm nào trong đơn hàng này.</p>
                                )}
                            </div>

                        </div>
                        <button
                            onClick={closeModal}
                            className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default OrderList2;
