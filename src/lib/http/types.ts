export interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  retries?: number;
  rateLimit?: number;
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export interface HttpError {
  message: string;
  status?: number;
  data?: unknown;
}

export interface FormError {
  [key: string]: string[];
}

export interface IHttpClient {
  get<T>(
    url: string,
    params?: Record<string, unknown>
  ): Promise<HttpResponse<T>>;
  post<T>(
    url: string,
    data?: unknown,
    config?: Record<string, unknown>
  ): Promise<HttpResponse<T>>;
  put<T>(
    url: string,
    data?: unknown,
    config?: Record<string, unknown>
  ): Promise<HttpResponse<T>>;
  patch<T>(
    url: string,
    data?: unknown,
    config?: Record<string, unknown>
  ): Promise<HttpResponse<T>>;
  delete<T>(
    url: string,
    config?: Record<string, unknown>
  ): Promise<HttpResponse<T>>;
  setAuthToken(token: string): void;
  removeAuthToken(): void;
}
