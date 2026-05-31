import axios, { type AxiosError } from 'axios'
import { DEFAULT_ERROR_MESSAGE } from '../constants'

export interface ApiErrorInfo {
  message: string
  status?: number
  code?: string | number
  details?: unknown
}

export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error)
}

export function normalizeAxiosError(error: unknown): ApiErrorInfo {
  if (!axios.isAxiosError(error)) {
    return normalizeError(error)
  }

  const response = error.response
  const data = response?.data as { message?: string; error?: string } | undefined
  const message =
    data?.message ||
    data?.error ||
    response?.statusText ||
    error.message ||
    DEFAULT_ERROR_MESSAGE

  return {
    message,
    status: response?.status,
    code: error.code,
    details: data ?? response?.data,
  }
}

export function normalizeError(error: unknown): ApiErrorInfo {
  if (error instanceof Error) {
    return {
      message: error.message,
      details: error,
    }
  }

  if (typeof error === 'string') {
    return {
      message: error,
    }
  }

  return {
    message: DEFAULT_ERROR_MESSAGE,
    details: error,
  }
}

export function getErrorMessage(error: unknown): string {
  return normalizeError(error).message
}
