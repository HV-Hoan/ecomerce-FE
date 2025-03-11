import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogOut = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");

        if (confirmLogout) {
            fetch("http://localhost:5000/logout", {
                method: "POST",
                credentials: "include", // Để gửi cookie chứa refreshToken
            })
                .then((response) => {
                    if (response.ok) {
                        localStorage.removeItem("token"); // Xóa token khỏi localStorage
                        navigate("/login"); // Chuyển hướng về trang đăng nhập
                    } else {
                        alert("Có lỗi xảy ra khi đăng xuất.");
                    }
                })
                .catch((error) => {
                    console.error("Lỗi khi gọi API logout:", error);
                    alert("Không thể kết nối đến server.");
                });
        } else {
            navigate(-1); // Quay lại trang trước đó nếu từ chối đăng xuất
        }
    }, [navigate]);

    return null; // Không cần hiển thị gì cả
};

export default LogOut;
