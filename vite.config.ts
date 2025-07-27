// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path'; // Import 'resolve' from 'path' module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Configure Vite to build as a library
    lib: {
      // Entry point for the library
      entry: resolve(__dirname, 'src/index.ts'),
      // The name of the global variable that will be exposed in UMD builds
      name: 'ReactMVCDataTable',
      // The name of the output file (e.g., my-react-plugin.js)
      fileName: (format) => `react-mvc-datatable.${format}.js`,
    },
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled into your library.
      // This prevents React and MUI from being duplicated if the consumer project also uses them.
      external: ['react', 'react-dom', '@mui/material', '@emotion/react', '@emotion/styled'],
      output: {
        // Global variables to use for externalized deps in UMD build
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@mui/material': 'MaterialUI',
          '@emotion/react': 'EmotionReact',
          '@emotion/styled': 'EmotionStyled',
        },
      },
    },
  },
});
