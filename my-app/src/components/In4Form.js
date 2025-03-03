import { useEffect, useState } from "react";
import "../css/UserProfile.css";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({});
    const [selectedImage, setSelectedImage] = useState(null); // Lưu ảnh tạm thời
    const token = localStorage.getItem("token");
    const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

    useEffect(() => {
        if (!userId) {
            console.error("User ID not found in token");
            return;
        }

        fetch(`http://localhost:5000/api/account/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                setUser(data);
                setUpdatedUser({ fullname: data.fullname, address: data.address });
            })
            .catch((error) => console.error("Error fetching user:", error));
    }, [userId]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file)); // Hiển thị ảnh trước khi upload
            setUpdatedUser({ ...updatedUser, image_Avatar: file });
        }
    };

    const handleSave = () => {
        const formData = new FormData();
        formData.append("fullname", updatedUser.fullname);
        formData.append("address", updatedUser.address);
        if (updatedUser.image_Avatar) {
            formData.append("image_Avatar", updatedUser.image_Avatar);
        }

        fetch(`http://localhost:5000/api/account/${userId}`, {
            method: "PUT",
            body: formData,
        }).then(() => {
            window.location.reload();
        });
    };

    if (!user) {
        return <p className="loading-text">Loading...</p>;
    }

    return (
        <div className="user-profile-container">
            <h2 className="user-profile-title">User Profile</h2>
            <div className="user-profile-content">
                <img
                    src={selectedImage || user.image_Avatar || "https://via.placeholder.com/150"}
                    alt="Avatar"
                    className="user-avatar"
                />
                {isEditing ? (
                    <>
                        <div className="user-input-group">
                            <input name="fullname" value={updatedUser.fullname || ""} onChange={handleChange} placeholder="Full Name" />
                            <input name="address" value={updatedUser.address || ""} onChange={handleChange} placeholder="Address" />
                            <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
                        </div>
                        <button className="save-btn" onClick={handleSave}>Save</button>
                    </>
                ) : (
                    <>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Full Name:</strong> {user.fullname || "N/A"}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Address:</strong> {user.address}</p>
                        <button className="edit-btn" onClick={handleEdit}>Edit</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
