/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // add other environment variables here, e.g.:
  // readonly VITE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
