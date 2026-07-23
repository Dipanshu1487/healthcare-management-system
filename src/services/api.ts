const BASE_URL = "http://localhost:8000/api/v1";

interface FetchOptions extends RequestInit {
  token?: string;
}

class APIClient {
  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    const activeToken = token || localStorage.getItem("access_token");
    if (activeToken) {
      headers["Authorization"] = `Bearer ${activeToken}`;
    }
    return headers;
  }

  async request<T>(path: string, options: FetchOptions = {}): Promise<T> {
    const url = `${BASE_URL}${path}`;
    const headers = this.getHeaders(options.token);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    const payload = await response.json();
    if (!response.ok || !payload.success) {
      throw new Error(payload.message || "API request failed");
    }

    return payload.data as T;
  }

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  }

  clearTokens() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
}

export const api = new APIClient();
export default api;
