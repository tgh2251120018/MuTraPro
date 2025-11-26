import { jwtDecode } from 'jwt-decode';
import { type JwtPayload, type User } from '../types/auth';

export const getUserFromToken = (token: string): User | null => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);

        // Kiểm tra xem token đã hết hạn chưa
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            return null;
        }

        // Map dữ liệu từ Token sang User Object
        return {
            id: decoded.sub,
            role: decoded.role,
            accountType: decoded.account_type,
        };
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
};