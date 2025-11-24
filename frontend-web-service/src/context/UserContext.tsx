import { createContext, useState, type ReactNode } from 'react';
import { type User } from '../types/auth';
import { getUserFromToken } from '../utils/authUtils';

interface UserContextType {
    user: User | null;
    updateUser: (userData: User | null) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

// Fix lỗi Fast Refresh: Thêm dòng comment này để ESLint bỏ qua việc check export Context
// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<UserContextType>({
    user: null,
    updateUser: () => { },
    logout: () => { },
    isAuthenticated: false,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    // [SOLUTION] Lazy Initialization:
    // Thay vì dùng useEffect, ta truyền một hàm vào useState.
    // Hàm này sẽ kiểm tra localStorage NGAY LẬP TỨC khi app khởi chạy.
    const [user, setUser] = useState<User | null>(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const decodedUser = getUserFromToken(token);
            if (decodedUser) {
                return decodedUser; // Giá trị khởi tạo ban đầu là User
            }

            // Nếu token rác/hết hạn thì dọn dẹp luôn
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
        return null; // Giá trị khởi tạo mặc định
    });

    const updateUser = (userData: User | null) => {
        setUser(userData);
        // Nếu set user = null (logout) thì xóa luôn token
        if (!userData) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, updateUser, logout, isAuthenticated: !!user }}>
            {children}
        </UserContext.Provider>
    );
};