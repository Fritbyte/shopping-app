import axios from "axios";
import {API_ENDPOINTS} from "../constants/api";
import type {ShoppingElement} from "../types/shoppingElement";

export const createShoppingElementApi = (token: string) => {
    if (!token) return null;
    const api = axios.create({
        baseURL: API_ENDPOINTS.SHOPPING_ELEMENT.BASE,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    return {
        getAll: async (listId: number): Promise<ShoppingElement[]> => {
            const {data} = await api.get<ShoppingElement[]>(`/shopping-list/${listId}`);
            return data;
        },
        create: async (newElement: Omit<ShoppingElement, "id">): Promise<ShoppingElement> => {
            const {data} = await api.post<ShoppingElement>("", newElement);
            return data;
        },
        update: async (id: number, newElement: Omit<ShoppingElement, "id">): Promise<ShoppingElement> => {
            const {data} = await api.put<ShoppingElement>(`/${id}`, newElement);
            return data;
        },
        delete: async (id: number): Promise<void> => {
            await api.delete(`/${id}`);
        }
    };
};
