import api from "./config/axios.config.ts";
import type { RecapResponse } from "../types/recap.ts";



export const getTerrain = async (idClient: string): Promise<any> => {
    const res = await api.get(`/clients/${idClient}/terrains`)
    return res;
}

export const getProduits = async (idClient: string, idTerrain: string): Promise<any> => {
    const res = await api.get(`/clients/${idClient}/terrains/${idTerrain}/produits`)
    return res;
}


export const getRecap = async (id: string): Promise<RecapResponse> => {
    // Note: The path is /simulator/draft/{id} based on user example
    // Our proxy handles /api-proxy -> /api
    // So the full URL will be /api-proxy/simulator/draft/{id}
    const response = await api.get<RecapResponse>(`/simulator/draft/${id}`);
    return response.data;
};
