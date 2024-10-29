import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 80,
    watch: {
      usePolling: true,  // Enable polling
      interval: 100,     // Polling interval in ms
    },
  },
});
