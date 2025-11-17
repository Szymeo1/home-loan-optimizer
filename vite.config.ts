import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

// Get git commit hash
const getGitHash = () => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'dev'
  }
}

// Get version from package.json
const getVersion = () => {
  try {
    return require('./package.json').version
  } catch {
    return '1.0.0'
  }
}

export default defineConfig({
  plugins: [react()],
  base: '/home-loan-optimizer/',
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(getVersion()),
    'import.meta.env.VITE_COMMIT_HASH': JSON.stringify(getGitHash()),
  },
})
