import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

const allowedHosts = ['dashboard.akimmo.center']

const proxyConfig = {
  '/api-proxy': {
    target: 'https://akimmo.center',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/api-proxy/, '/api'),
    secure: false,
  },
  '/api_proxy': {
    target: 'https://akimmo.center',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/api_proxy/, '/api'),
    secure: false,
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    allowedHosts,
    proxy: proxyConfig,
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts,
    proxy: proxyConfig,
  },
})