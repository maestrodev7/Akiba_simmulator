import { defineConfig } from 'vite'

const allowedHosts = ['dashboard.akimmo.center']

export default defineConfig({
  preview: {
    host: '0.0.0.0',
    allowedHosts,
  },
})
