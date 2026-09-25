import axios from "axios";

// Uses VITE_API_URL if specified, or defaults to /api for origin proxying.
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300_000,
});

export const setAuthHeader = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

type ValidationIssue = {
  loc?: unknown;
  msg?: unknown;
};

/**
 * Converts Axios/FastAPI errors into text that is always safe to render in JSX.
 */
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string" && detail.trim()) return detail;

    if (Array.isArray(detail)) {
      const messages = detail
        .filter((issue): issue is ValidationIssue => Boolean(issue) && typeof issue === "object")
        .map((issue) => {
          const field = Array.isArray(issue.loc) ? issue.loc.at(-1) : undefined;
          const message = typeof issue.msg === "string" ? issue.msg : "Invalid value";
          return typeof field === "string" || typeof field === "number"
            ? `${field}: ${message}`
            : message;
        })
        .filter(Boolean);
      if (messages.length) return messages.join(". ");
    }

    if (typeof error.message === "string" && error.message) return error.message;
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

export default api;
