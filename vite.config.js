import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000, // o el puerto que prefieras
  },
});