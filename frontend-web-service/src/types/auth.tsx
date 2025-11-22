/**
 * Interface representing the User model based on your backend response.
 */
export interface User {
    id: string;
    username: string;
    email: string;
    role: 'user' | 'admin'; // [INSTRUCTION_B] Adjust roles based on your actual backend logic [INSTRUCTION_E]
    profileImageUrl?: string;
}

/**
 * Interface for the Auth API response (Login/Register).
 */
export interface AuthResponse {
    token: string;
    user: User;
    message?: string;
}