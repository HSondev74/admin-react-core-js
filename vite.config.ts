import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = `${env.VITE_APP_BASE_NAME}`;
  const PORT = 3000;

  return {
    server: {
      open: true,
      port: PORT,
      host: true,
    },
    preview: {
      open: true,
      host: true,
    },
    define: {
      'process.env': {}
    },
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
      ],
    },
    base: API_URL,
    plugins: [react()],
  };
});
