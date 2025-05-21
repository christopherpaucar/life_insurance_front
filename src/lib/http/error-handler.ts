import { HttpError, FormError } from './types';

// Define a type for response errors to avoid 'any' usage
interface ResponseError {
  response?: {
    status: number;
    data: {
      errors?: Record<string, string[]>;
      message?: string;
    };
  };
}

/**
 * Handles HTTP errors and displays appropriate toast messages
 */
export const handleHttpError = (error: unknown): HttpError => {
  const httpError: HttpError = {
    message: 'An unexpected error occurred',
  };

  if (error instanceof Error) {
    httpError.message = error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const responseError = error as ResponseError;
    if (responseError.response) {
      httpError.status = responseError.response.status;
      httpError.data = responseError.response.data;

      if (httpError.status === 401) {
        httpError.message = 'Se requiere autenticación';
      } else if (httpError.status === 403) {
        httpError.message = 'No tienes permisos para realizar esta acción';
      } else if (httpError.status === 404) {
        httpError.message = 'No se encontró el recurso';
      }
    }
  }

  return httpError as Error;
};

/**
 * Handles form validation errors
 */
export const handleFormError = (error: unknown): FormError | null => {
  if (typeof error === 'object' && error !== null) {
    const responseError = error as ResponseError;

    if (responseError.response?.status === 422 && responseError.response?.data?.errors) {
      return responseError.response.data.errors as FormError;
    }
  }

  // If it's not a form validation error, just handle it as a regular HTTP error
  handleHttpError(error);
  return null;
};
