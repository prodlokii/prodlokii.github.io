import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { soundcloudTracksPlugin } from './plugins/soundcloudTracksPlugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), soundcloudTracksPlugin()],
})
