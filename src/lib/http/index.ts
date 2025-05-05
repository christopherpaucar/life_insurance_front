export * from './types'
export * from './http-client'
export * from './error-handler'

import { HttpClient } from './http-client'
import type { HttpClientConfig, IHttpClient } from './types'

// Default API client instance for general use
let defaultClient: IHttpClient | null = null

/**
 * Create a configured HTTP client instance
 */
export const createHttpClient = (config?: Partial<HttpClientConfig>): IHttpClient => {
  return new HttpClient(config)
}

/**
 * Get or create the default HTTP client instance
 */
export const getHttpClient = (): IHttpClient => {
  if (!defaultClient) {
    defaultClient = createHttpClient()
  }
  return defaultClient
}

/**
 * Set authentication token on the default client
 */
export const setAuthToken = (token: string): void => {
  getHttpClient().setAuthToken(token)
}

/**
 * Remove authentication token from the default client
 */
export const removeAuthToken = (): void => {
  getHttpClient().removeAuthToken()
}
