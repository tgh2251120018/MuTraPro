import { createContext, useState, type ReactNode, useCallback } from 'react';
import { type User } from '../types/auth';
import { getUserFromToken } from '../utils/authUtils';

interface UserContextType {
    user: User | null;
    updateUser: (userData: User | null) => void;
    logout: () => void;
    refreshUser: () => void; // [NEW] Hàm để ép cập nhật lại từ Token
    isAuthenticated: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<UserContextType>({
    user: null,
    updateUser: () => { },
    logout: () => { },
    refreshUser: () => { },
    isAuthenticated: false,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {

    // Hàm helper để parse token (tách ra để tái sử dụng)
    const parseUserFromStorage = (): User | null => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const decodedUser = getUserFromToken(token);
            if (decodedUser) return decodedUser;

            // Token lỗi -> Xóa
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
        return null;
    };

    // Lazy Init: Chỉ chạy 1 lần khi F5
    const [user, setUser] = useState<User | null>(() => parseUserFromStorage());

    // Cập nhật User thủ công (thường dùng khi login xong hoặc fetch profile xong)
    const updateUser = useCallback((userData: User | null) => {
        setUser(userData);
        if (!userData) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    }, []);

    // [NEW] Hàm này dùng để ép Context đọc lại Token mới nhất từ LocalStorage
    // Hữu ích khi Axios Interceptor tự động refresh token ở background
    const refreshUser = useCallback(() => {
        const updatedUser = parseUserFromStorage();
        // Chỉ update nếu thực sự có sự thay đổi để tránh re-render thừa
        setUser((prev) => {
            // Logic so sánh đơn giản, hoặc luôn update nếu muốn chắc chắn
            if (JSON.stringify(prev) !== JSON.stringify(updatedUser)) {
                // Nếu user cũ đã có full info (từ API profile), mà token mới chỉ có basic info
                // Ta nên merge lại để không bị mất display name
                if (prev && updatedUser && prev.id === updatedUser.id) {
                    return { ...prev, ...updatedUser };
                }
                return updatedUser;
            }
            return prev;
        });
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    }, []);

    return (
        <UserContext.Provider value={{ user, updateUser, logout, refreshUser, isAuthenticated: !!user }}>
            {children}
        </UserContext.Provider>
    );
};