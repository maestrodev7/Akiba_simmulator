import api from "./config/axios.config.ts";
import type { ClientResponse } from "../types/client.ts";

export const getClients = async (page = 1): Promise<ClientResponse> => {
    const response = await api.get<ClientResponse>(`/api/clients?page=${page}`);
    return response.data;
};
