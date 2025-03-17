import axios from "axios";
import {API_BASE_URL, API_ENDPOINTS} from "../constants/api.ts";
import type {AuthResponse, LoginCredentials, RegisterCredentials} from "../types/auth.ts";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
    const {data} = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return data;
}

export async function registerUser(credentials: RegisterCredentials): Promise<AuthResponse> {
    const {data} = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, credentials);
    return data;
}
