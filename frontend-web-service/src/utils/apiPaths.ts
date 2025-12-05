export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register"
    },
    USER: {
        GET_PROFILE: (userId: string) => `/user-profile/${userId}`,
    },
    REQUESTS: {
        CREATE: '/requests/',
        GET_ALL: '/requests/', // GET request trả về danh sách
    }
}