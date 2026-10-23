import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const supabaseTarget = env.VITE_SUPABASE_URL || 'https://xiagdgmneovtgsafwqhz.supabase.co';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/supabase': {
          target: supabaseTarget,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/supabase/, '')
        }
      }
    }
  };
});

