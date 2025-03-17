import axios from 'axios'
import {API_ENDPOINTS} from '../constants/api'
import type {Gateway} from '../types/gateway'

export const createGatewayApi = (token: string) => {
    const api = axios.create({
        baseURL: API_ENDPOINTS.GATEWAYS.BASE,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })

    return {
        getAll: async (): Promise<Gateway[]> => {
            const {data} = await api.get<Gateway[]>(API_ENDPOINTS.GATEWAYS.BASE)
            return data
        },

        create: async (gateway: Omit<Gateway, 'id'>): Promise<Gateway> => {
            const {data} = await api.post<Gateway>(API_ENDPOINTS.GATEWAYS.BASE, gateway)
            return data
        },

        update: async (gateway: Gateway): Promise<Gateway> => {
            const {data} = await api.put<Gateway>(API_ENDPOINTS.GATEWAYS.BY_ID(gateway.id), gateway);
            return data;
        },

        delete: async (id: number): Promise<void> => {
            await api.delete(API_ENDPOINTS.GATEWAYS.BY_ID(id))
        }
    }
}