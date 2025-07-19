import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  host: true, // This allows access via your local IP address
  port: 5173, // Ensure this matches the port you want to use
});

