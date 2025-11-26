import React, { useEffect, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import '../../styles/main_page.css';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { type UserProfileResponse } from '../../types/auth';

const MainLayout: React.FC = () => {
    const { user, updateUser } = useContext(UserContext);

    useEffect(() => {
        // Chỉ gọi API nếu đã có user ID (tức là đã login và có token)
        const fetchUserProfile = async () => {
            if (user?.id) {
                try {
                    const endpoint = API_PATHS.USER.GET_PROFILE(user.id);
                    const response = await axiosInstance.get<UserProfileResponse>(endpoint);
                    const profileData = response.data;

                    // Cập nhật lại Context với dữ liệu mới nhất từ Server
                    // Merge dữ liệu cũ (id, token info) với dữ liệu mới (profile info)
                    updateUser({
                        ...user,
                        fullName: profileData.display_name, // Map display_name -> fullName
                        email: profileData.username,        // Map username -> email (hoặc tạo field mới username trong User type)
                        username: profileData.username,     // Nếu User type có field này
                        role: profileData.role,
                        profileImageUrl: profileData.avatarURL
                    });

                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                    // Không cần logout hay redirect lỗi, chỉ log để debug
                }
            }
        };

        fetchUserProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Chỉ chạy 1 lần khi mount (hoặc khi user.id thay đổi logic user.id có thể thêm vào deps)

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-content-wrapper">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;