// vite.config.ts - FINAL CLEAN VERSION
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path'; // REQUIRED

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      // NOTE: Keeping the version aliases as you had them, but only using ONE @ alias
      'vaul@1.1.2': 'vaul',
      'sonner@2.0.3': 'sonner',
      'recharts@2.15.2': 'recharts',
      'react-resizable-panels@2.1.7': 'react-resizable-panels',
      // ... all your Radix-UI aliases ...
      '@': path.resolve(__dirname, './src'), 
    },
  },
  
  build: {
    target: 'esnext',
    outDir: 'dist', 
  },
  
  server: {
    port: 3000,
    open: true,
  },
});
