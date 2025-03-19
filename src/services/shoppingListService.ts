import axios from "axios";
import {API_ENDPOINTS} from "../constants/api";
import type {ShoppingList} from "../types/shoppingList";

export const createShoppingListApi = (token: string) => {
    if (!token) {
        return null;
    }

    const api = axios.create({
        baseURL: API_ENDPOINTS.SHOPPING_LIST.BASE,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    return {
        getAll: async (userId: number): Promise<ShoppingList[]> => {
            const {data} = await api.get<ShoppingList[]>(
                `${API_ENDPOINTS.SHOPPING_LIST.BASE}?user_id=${userId}`
            );
            return data;
        },

        create: async (shoppingList: Omit<ShoppingList, "id">): Promise<ShoppingList> => {
            const {data} = await api.post<ShoppingList>(
                API_ENDPOINTS.SHOPPING_LIST.BASE,
                shoppingList
            );
            return data;
        },

        update: async (id: number, shoppingList: Omit<ShoppingList, "id">): Promise<ShoppingList> => {
            const {data} = await api.put<ShoppingList>(
                `${API_ENDPOINTS.SHOPPING_LIST.BASE}/${id}`,
                shoppingList
            );
            return data;
        },

        delete: async (id: number): Promise<void> => {
            await api.delete(`${API_ENDPOINTS.SHOPPING_LIST.BASE}/${id}`);
        },
    };
};

