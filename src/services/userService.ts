import axios from "axios";
import {API_ENDPOINTS} from "../constants/api.ts";
import type {User} from "../types/auth";

export const createUserApi = (token: string) => {
    if (!token) {
        console.error("Ошибка: Токен отсутствует!");
        return null;
    }

    const api = axios.create({
        baseURL: API_ENDPOINTS.USERS.BASE,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    return {
        getAll: async (): Promise<User[]> => {
            console.log("Запрос на получение всех пользователей:", API_ENDPOINTS.USERS.BASE);
            const {data} = await api.get<User[]>(API_ENDPOINTS.USERS.BASE);
            return data;
        },

        delete: async (id: number): Promise<void> => {
            console.log(`Удаление пользователя ${id}`);
            await api.delete(API_ENDPOINTS.USERS.BY_ID(id));
        }
    };
};
