import api from "./config/axios.config.ts";
import type { ClientResponse } from "../types/client.ts";


export const getALlClients = async (page: number = 1): Promise<ClientResponse> => {
    const response = await api.get<ClientResponse>(`/clients?page=${page}`);
    return response.data;
}

export const getclientFilter = async (filter: string, page: number = 1): Promise<ClientResponse> => {
    const response = await api.get<ClientResponse>(`/clients?page=${page}&payment_status=${filter}`);
    return response.data;
}

export const getClients = async (filter: string = "all", page = 1): Promise<ClientResponse> => {
    if (filter == "all") {
        return getALlClients(page)
    } else {
        return getclientFilter(filter, page)
    }

};
