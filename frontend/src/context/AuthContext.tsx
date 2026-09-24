import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { PropsWithChildren } from "react";
import api, { setAuthHeader } from "../lib/api";

type TokenResponse = { access_token: string; refresh_token: string };
let refreshInFlight: Promise<TokenResponse> | null = null;

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  userEmail: string | null;
};

type AuthContextValue = AuthState & {
  isRestoring: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const storageKey = "draftly.auth";

const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (!payload.exp) return false;
    return payload.exp * 1000 <= Date.now() + 5000;
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: null,
    refreshToken: null,
    userEmail: null,
  });
  const [isRestoring, setIsRestoring] = useState(true);

  const persist = useCallback((state: AuthState) => {
    setAuthState(state);
    setAuthHeader(state.accessToken);
    if (state.accessToken || state.refreshToken) {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } else {
      localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    const restoreAuth = async () => {
      const stored = localStorage.getItem(storageKey);
      if (!stored) {
        setIsRestoring(false);
        return;
      }
      try {
        const parsed = JSON.parse(stored) as AuthState;
        if (parsed.accessToken && !isTokenExpired(parsed.accessToken)) {
          persist(parsed);
        } else if (parsed.refreshToken) {
          try {
            refreshInFlight ??= api
              .post<TokenResponse>("/auth/refresh", { refresh_token: parsed.refreshToken })
              .then(({ data }) => data)
              .finally(() => {
                refreshInFlight = null;
              });
            const tokens = await refreshInFlight;
            persist({
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token,
              userEmail: parsed.userEmail,
            });
          } catch {
            persist({ accessToken: null, refreshToken: null, userEmail: null });
          }
        } else {
          persist({ accessToken: null, refreshToken: null, userEmail: null });
        }
      } catch {
        localStorage.removeItem(storageKey);
      } finally {
        setIsRestoring(false);
      }
    };

    void restoreAuth();
  }, [persist]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const request = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
        const url = String(request?.url ?? "");
        if (
          error.response?.status !== 401 ||
          !request ||
          request._retry ||
          url.includes("/auth/login") ||
          url.includes("/auth/refresh") ||
          url.includes("/auth/logout")
        ) {
          return Promise.reject(error);
        }

        const stored = localStorage.getItem(storageKey);
        let current: AuthState | null = null;
        try {
          current = stored ? (JSON.parse(stored) as AuthState) : null;
        } catch {
          localStorage.removeItem(storageKey);
        }
        if (!current?.refreshToken) {
          persist({ accessToken: null, refreshToken: null, userEmail: null });
          return Promise.reject(error);
        }

        try {
          refreshInFlight ??= api
            .post<TokenResponse>("/auth/refresh", { refresh_token: current.refreshToken })
            .then(({ data }) => data)
            .finally(() => {
              refreshInFlight = null;
            });
          const tokens = await refreshInFlight;
          const nextState: AuthState = {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            userEmail: current.userEmail,
          };
          persist(nextState);
          request._retry = true;
          request.headers = request.headers || {};
          request.headers.Authorization = `Bearer ${nextState.accessToken}`;
          return api(request);
        } catch (refreshError) {
          persist({ accessToken: null, refreshToken: null, userEmail: null });
          return Promise.reject(refreshError);
        }
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [persist]);

  const login = useCallback(
    async (email: string, password: string) => {
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);
      const { data } = await api.post("/auth/login", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      persist({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        userEmail: email,
      });
    },
    [persist]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      await api.post("/auth/register", { email, password });
      await login(email, password);
    },
    [login]
  );

  const logout = useCallback(() => {
    if (authState.refreshToken) {
      void api.post("/auth/logout", { refresh_token: authState.refreshToken }).catch(() => undefined);
    }
    persist({ accessToken: null, refreshToken: null, userEmail: null });
  }, [authState.refreshToken, persist]);

  const value = useMemo(
    () => ({
      ...authState,
      isRestoring,
      login,
      register,
      logout,
    }),
    [authState, isRestoring, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}; 
















