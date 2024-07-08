import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
/*export default defineConfig({
  plugins: [react()],
})*/
export default defineConfig((props) => {
  const env = loadEnv(props.mode, process.cwd(), "VITE_API");
  const envWithProcessPrefix = {
    "process.env": `${JSON.stringify(env)}`,
  };

  return {
    plugins: [
      react(),
    ],
    define: envWithProcessPrefix,
  }
})

