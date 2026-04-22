import type { AuthInfo } from "../../types/auth";
import { getAuthInfo } from "../loginService.ts";
import api from "./axios.config.ts";

api.interceptors.request.use((config) => {
    const authData: AuthInfo | null = getAuthInfo();
    if (authData?.accessToken) {
        config.headers.Authorization = `Bearer ${authData.accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            window.dispatchEvent(new CustomEvent("notification", {
                detail: {
                    message: "Unauthorized access. Please login again.",
                    type: "error"
                }
            }));

            console.warn("Unauthorized - redirect to login");
            sessionStorage.removeItem("user");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);
