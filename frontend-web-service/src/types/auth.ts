// 1. Cấu trúc dữ liệu bên trong Token (Payload)
export interface JwtPayload {
    sub: string;          // User ID (UUID)
    role: string;         // e.g., "CUSTOMER"
    account_type: string; // e.g., "USER"
    iat: number;          // Issued At
    exp: number;          // Expiration Time
}

// 2. Cấu trúc User trong ứng dụng Frontend (Map từ Payload sang)
export interface User {
    fullName: string;
    email: string;
    username: string;
    id: string;
    role: string;
    accountType: string;
    profileImageUrl?: string;
    // Các thông tin khác như email/name chưa có trong token, 
    // tạm thời ta dùng thông tin từ token trước.
}

export interface UserProfileResponse {
    avatarURL: string;
    username: string;
    display_name: string;
    role: string;
}


// 3. Cấu trúc Response trả về từ API Login
export interface LoginResponse {
    access_token: string;
    refresh_token: string;
}

export interface RegisterResponse {
    resultCode: string;
}