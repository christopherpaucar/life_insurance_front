import type { HttpClientConfig, IHttpClient } from './types';
import { HttpClient } from './http-client';

let defaultClient: IHttpClient | null = null;

export const createHttpClient = (config?: Partial<HttpClientConfig>): IHttpClient => {
  return new HttpClient(config);
};

export const getHttpClient = (): IHttpClient => {
  if (!defaultClient) {
    defaultClient = createHttpClient();
  }
  return defaultClient;
};

export const setAuthToken = (token: string): void => {
  getHttpClient().setAuthToken(token);
};

export const removeAuthToken = (): void => {
  getHttpClient().removeAuthToken();
};

export * from './types';
export * from './error-handler';
