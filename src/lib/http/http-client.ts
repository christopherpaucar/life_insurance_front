import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { handleHttpError } from './error-handler'
import { HttpClientConfig, HttpResponse, IHttpClient } from './types'
import { toast } from 'sonner'

/**
 * Default HTTP client configuration
 */
const DEFAULT_CONFIG: HttpClientConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  retries: 3,
  rateLimit: 100,
}

/**
 * HTTP client implementation using Axios
 */
export class HttpClient implements IHttpClient {
  private axiosInstance: AxiosInstance
  private config: HttpClientConfig

  constructor(config: Partial<HttpClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.axiosInstance = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: this.config.headers,
    })

    this.setupInterceptors()
  }

  /**
   * Set up request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor for authentication and other request modifications
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add rate limiting logic here if needed
        return config
      },
      (error) => Promise.reject(error as Error)
    )

    // Response interceptor for global error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Implement retry logic here if needed
        if (this.config.retries && this.config.retries > 0) {
          // Retry logic would go here
        }
        return Promise.reject(error as Error)
      }
    )

    // Add request interceptor for authentication
    this.axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.token

      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    })

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          toast.error('Sesión expirada, por favor inicie sesión nuevamente')

          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
        }

        if (error.response?.status === 403) {
          toast.error('No tienes permisos para acceder a este recurso')

          if (typeof window !== 'undefined' && !window.location.pathname.includes('/dashboard')) {
            window.location.href = '/dashboard'
          }
        }

        return Promise.reject(error as Error)
      }
    )
  }

  /**
   * Transform Axios response to our standard HttpResponse
   */
  private transformResponse<T>(response: AxiosResponse): HttpResponse<T> {
    return {
      data: response.data,
      status: response.status,
      headers: response.headers as Record<string, string>,
    }
  }

  /**
   * Execute HTTP request with error handling
   */
  private async executeRequest<T>(
    requestFn: () => Promise<AxiosResponse>
  ): Promise<HttpResponse<T>> {
    try {
      const response = await requestFn()
      return this.transformResponse<T>(response)
    } catch (error) {
      throw handleHttpError(error) as Error
    }
  }

  /**
   * Set authentication token
   */
  public setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  /**
   * Remove authentication token
   */
  public removeAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization']
  }

  /**
   * HTTP GET method
   */
  public async get<T>(url: string, params?: Record<string, unknown>): Promise<HttpResponse<T>> {
    return this.executeRequest<T>(() => this.axiosInstance.get(url, { params }))
  }

  /**
   * HTTP POST method
   */
  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.executeRequest<T>(() => this.axiosInstance.post(url, data, config))
  }

  /**
   * HTTP PUT method
   */
  public async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.executeRequest<T>(() => this.axiosInstance.put(url, data, config))
  }

  /**
   * HTTP PATCH method
   */
  public async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.executeRequest<T>(() => this.axiosInstance.patch(url, data, config))
  }

  /**
   * HTTP DELETE method
   */
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<HttpResponse<T>> {
    return this.executeRequest<T>(() => this.axiosInstance.delete(url, config))
  }
}
