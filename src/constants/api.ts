export const API_BASE_URL = "http://localhost:8080/api/v1"

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        REGISTER: `${API_BASE_URL}/auth/register`
    },
    USERS: {
        BASE: `${API_BASE_URL}/users`,
        BY_ID: (id: number) => `${API_BASE_URL}/users/${id}`,
    },
    GATEWAYS: {
        BASE: `${API_BASE_URL}/gateways`,
        BY_ID: (id: number) => `${API_BASE_URL}/gateways/${id}`
    }
} as const