import api from "./config/axios.config";
import type { LoginResponse, AuthInfo } from "../types/auth";

const USER_KEY = "user";

export const login = async (payload: any): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/api/admin/login", payload);
    if (response.data.success) {
        saveAuthInfo({
            accessToken: response.data.data.token,
            tokenType: response.data.data.token_type,
            expiresIn: response.data.data.expires_in,
            user: response.data.data.user
        });
    }
    return response.data;
};

export const saveAuthInfo = (authInfo: AuthInfo): void => {
    sessionStorage.setItem(USER_KEY, JSON.stringify(authInfo));
};

export const getAuthInfo = (): AuthInfo | null => {
    const data = sessionStorage.getItem(USER_KEY);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
};

export const logout = (): void => {
    sessionStorage.removeItem(USER_KEY);
    window.location.href = "/";
};
