import axios from "axios";
import { navigateToLogin } from "../utils/navigationUtils";
import { getCookie, setCookie, deleteCookie } from "../utils/cookieUtils";

const VAR_BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

let isRefreshing = false;
let refreshPromise = null;

axios.defaults.baseURL = VAR_BACKEND_BASE_URL || "http://localhost:8080";
axios.defaults.withCredentials = true;

// Add token to requests
axios.interceptors.request.use(
    (config) => {
        // Skip auth header for auth refresh requests
        if (config.skipAuthRefresh) {
            return config;
        }
        
        const token = getCookie('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

async function handleHttpRequest(method, url, payload) {
    try {
        const response = await axios[method](url, payload);
        return [response.data, undefined];
    } catch (err) {
        return [undefined, err.response?.data || err.message];
    }
}

function handleGetRequest(url) {
    return handleHttpRequest("get", url);
}

function handlePostRequest(url, payload = {}) {
    return handleHttpRequest("post", url, payload);
}

function handlePutRequest(url, payload = {}) {
    return handleHttpRequest("put", url, payload);
}

function handleDeleteRequest(url) {
    return handleHttpRequest("delete", url);
}

async function refreshAccessToken() {
    const refreshToken = getCookie('refreshToken');
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }
    
    const response = await axios.post("/api/users/refresh", 
        { refreshToken },
        { skipAuthRefresh: true }
    );
    
    // Update stored token
    if (response.data.token) {
        setCookie('authToken', response.data.token, 7);
    }
    
    return response.data;
}

function handleTokenRefresh() {
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = refreshAccessToken()
        .then((token) => {
            return token;
        })
        .catch((error) => {
            throw error;
        })
        .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
        });

    return refreshPromise;
}

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.skipAuthRefresh) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Check if user has a stored session (was previously authenticated)
            const storedUser = getCookie('user');
            
            if (storedUser) {
                // User was authenticated but token expired
                try {
                    await handleTokenRefresh();
                    return axios(originalRequest);
                } catch (refreshError) {
                    // Session expired for authenticated user
                    deleteCookie('user');
                    deleteCookie('authToken');
                    deleteCookie('refreshToken');
                    navigateToLogin('Your session has expired. Please log in again.');
                    return Promise.reject(refreshError);
                }
            } else {
                // User was never authenticated - just redirect without session expired message
                navigateToLogin();
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export { handleGetRequest, handlePostRequest, handlePutRequest, handleDeleteRequest };