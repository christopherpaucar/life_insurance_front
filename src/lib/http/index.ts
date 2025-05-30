import type { HttpClientConfig, IHttpClient } from './types'
import * as errorHandler from './error-handler'

let defaultClient: IHttpClient | null = null

const httpClientFactory = async (config?: Partial<HttpClientConfig>): Promise<IHttpClient> => {
  const { HttpClient } = await import('./http-client')
  return new HttpClient(config)
}

export const createHttpClient = async (
  config?: Partial<HttpClientConfig>
): Promise<IHttpClient> => {
  return httpClientFactory(config)
}

export const getHttpClient = async (): Promise<IHttpClient> => {
  if (!defaultClient) {
    defaultClient = await httpClientFactory()
  }
  return defaultClient
}

export const setAuthToken = async (token: string): Promise<void> => {
  const client = await getHttpClient()
  client.setAuthToken(token)
}

export const removeAuthToken = async (): Promise<void> => {
  const client = await getHttpClient()
  client.removeAuthToken()
}

export * from './types'
export { errorHandler }
