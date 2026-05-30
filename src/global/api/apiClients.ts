import axios from "axios";
// import { clearTokensAndUserName, decryptAndGetTokens } from "../helpers/storageTokens";

// Base configuration for API clients

const defaultHeaders = {
  "Content-Type": "application/json",
};

// Public API client (no interceptors)
const BASE_URL = import.meta.env.VITE_BASE_URL;
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: defaultHeaders,
});


// export const securedApiClient = axios.create({
//   baseURL: BASE_URL,
//   headers: defaultHeaders,
// });


// securedApiClient.interceptors.request.use(
//   (config) => {
//     const Tokens = decryptAndGetTokens();
//     if (Tokens?.accessToken) {
//       config.headers.Authorization = `Bearer ${Tokens?.accessToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );


// securedApiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;

//     if (status === 401) {
//       console.error("Unauthorized! Redirecting to login...");
//       clearTokensAndUserName();
//       window.location.href = "/auth"; // Redirect to login page
//     } else if (status === 403) {
//       console.error("Forbidden! You do not have access to this resource.");
//     } else if (status >= 500) {
//       console.error("Server error! Please try again later.");
//     }

//     return Promise.reject(error);
//   }
// );