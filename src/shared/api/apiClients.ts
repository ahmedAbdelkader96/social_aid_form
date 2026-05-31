/**
 * Shared API client configuration used by feature repositories.
 * Centralizes HTTP settings and keeps network plumbing out of components.
 */
import axios from 'axios'

const defaultHeaders = {
  'Content-Type': 'application/json',
}

const BASE_URL = import.meta.env.VITE_BASE_URL ?? ''

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: defaultHeaders,
})
