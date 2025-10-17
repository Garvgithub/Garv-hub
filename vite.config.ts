// vite.config.ts - Minimal, Clean, and Corrected for Vercel/Vite/TS
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path'; // Correct import for 'path'

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    // Keep standard extensions
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    
    alias: {
      // Keep only the necessary @ alias for './src'
      '@': path.resolve(__dirname, './src'),
      
      // NOTE: I am removing the 30+ version-specific aliases (e.g., 'vaul@1.1.2': 'vaul'). 
      // These are usually redundant and sometimes cause path confusion in CI/CD environments.
      // Your dependencies are already installed correctly by npm, so these aliases are not required 
      // for the build to find the packages.
    },
  },
  
  build: {
    target: 'esnext',
    // CHANGE: Setting the output back to 'dist' (Vercel/Vite default)
    // Your error log was from a previous attempt showing 'build', but 'dist' is safer.
    outDir: 'dist', 
  },
  
  server: {
    port: 3000,
    open: true,
  },
});
