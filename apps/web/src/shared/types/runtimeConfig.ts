export interface RuntimeConfig {
  apiUrl?: string
  apiTimeout?: string | number
  apiRetryAttempts?: string | number
  apiRetryDelay?: string | number
}

export interface ResolvedRuntimeConfig {
  apiUrl?: string
  apiTimeout?: number
  apiRetryAttempts?: number
  apiRetryDelay?: number
}

declare global {
  interface Window {
    __OPENFLASHCARDS_CONFIG__?: RuntimeConfig
  }
}
