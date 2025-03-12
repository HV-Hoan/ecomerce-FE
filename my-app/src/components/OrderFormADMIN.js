import { useEffect, useState } from "react";
import "../css/orderadmin.css";
import axios from "axios";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [newStatus, setNewStatus] = useState("");
    const [newPaymentStatus, setNewPaymentStatus] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/order/getall");
                setOrders(response.data.list_Order);
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
        try {
            const response = await axios.get(`http://localhost:5000/api/order/${orderId}`);
            setSelectedOrder(response.data);
            setShowModal(true); // Hiển thị modal khi có dữ liệu
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        }
    };

    const updateOrderStatus = async (orderId) => {
        try {
            await axios.put(`http://localhost:5000/api/order/${orderId}/update`, {
                status_Order: newStatus,
                payment_status: newPaymentStatus,
            });
            alert("Cập nhật trạng thái thành công!");
            setUpdateModal(false);
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi cập nhật đơn hàng:", error);
            alert("Lỗi khi cập nhật đơn hàng!");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    if (loading) return <p> Đang tải đơn hàng...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center"> Danh Sách Đơn Hàng</h2>
            {orders.length === 0 ? (
                <p className="text-gray-500 text-center">Không có đơn hàng nào.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="box-order border p-4 rounded-lg shadow-md">
                            <p className="text-lg font-semibold text-blue-600">Mã đơn hàng: {order.id}</p>
                            <p className="text-gray-700"><strong> Tổng tiền:</strong> {order.price.toLocaleString()} đ</p>
                            <p className="text-gray-700">
                                <strong>Trạng thái:</strong>{" "}
                                <span className={
                                    order.status_Order === "0"
                                        ? "text-yellow-500"
                                        : order.status_Order === "1"
                                            ? "text-green-500"
                                            : "text-red-500"
                                }>
                                    {order.status_Order === "0"
                                        ? " Chờ duyệt"
                                        : order.status_Order === "1"
                                            ? "Hoàn thành"
                                            : "Hủy"}
                                </span>
                            </p>

                            <p className="text-gray-700">
                                <strong> PT Thanh toán:</strong> {order.payment_method === "0" ? " Tiền mặt" : " Chuyển khoản"}
                            </p>
                            <p className="text-gray-700">
                                <strong> Thanh toán:</strong> {order.payment_status === "0"
                                    ? "Đang xử lý"
                                    : order.payment_status === "1"
                                        ? " Đã thanh toán "
                                        : " Đã hủy"}
                            </p>

                            <button
                                onClick={() => fetchOrderDetails(order.id)}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                            >
                                Xem chi tiết
                            </button>
                            <button
                                onClick={() => setUpdateModal(order.id)}
                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition"
                            >
                                Cập nhật trạng thái
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL Chi tiết đơn hàng */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
                    <div className="fixed-modal w-96 relative animate-slideIn" onClick={(e) => e.stopPropagation()}>

                        <h2 className="text-xl font-bold mb-4 text-center"> Chi tiết đơn hàng</h2>
                        <p className="text-gray-700"><strong> Mã đơn hàng:</strong> {selectedOrder.id}</p>
                        <p className="text-gray-700"><strong> Người mua:</strong> {selectedOrder.User?.fullname || "Không có dữ liệu"}</p>
                        <p className="text-gray-700"><strong> Địa chỉ:</strong> {selectedOrder.User?.address || "Không có dữ liệu"}</p>
                        <p className="text-gray-700"><strong> Tổng tiền:</strong> {selectedOrder.price.toLocaleString()} đ</p>

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

            {updateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Cập nhật đơn hàng</h2>
                        <label className="block">Trạng thái đơn hàng:</label>
                        <select className="border p-2 w-full" onChange={(e) => setNewStatus(e.target.value)}>
                            <option value="0">Chờ duyệt</option>
                            <option value="1">Hoàn thành</option>
                            <option value="2">Hủy</option>
                        </select>

                        <label className="block mt-4">Trạng thái thanh toán:</label>
                        <select className="border p-2 w-full" onChange={(e) => setNewPaymentStatus(e.target.value)}>
                            <option value="0">Đang xử lý</option>
                            <option value="1">Đã thanh toán</option>
                            <option value="2">Đã hủy</option>
                        </select>

                        <button
                            onClick={() => updateOrderStatus(updateModal)}
                            className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                        >
                            Cập nhật
                        </button>

                        <button
                            onClick={() => setUpdateModal(false)}
                            className="mt-2 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;
