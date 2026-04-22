import api from "./config/axios.config.ts";
import type { RecapResponse } from "../types/recap.ts";

export const getRecap = async (id: string): Promise<RecapResponse> => {
    // Note: The path is /simulator/draft/{id} based on user example
    // Our proxy handles /api-proxy -> /api
    // So the full URL will be /api-proxy/simulator/draft/{id}
    const response = await api.get<RecapResponse>(`/simulator/draft/${id}`);
    return response.data;
};
