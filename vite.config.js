// vite.config.js
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import viteCompression from 'vite-plugin-compression';
import { createHtmlPlugin } from 'vite-plugin-html';
import { resolve } from 'path';
import glob from 'glob';

const SHOULD_SHOW_CONSOLE_LOG = true;

// Get all HTML files from src directory
const htmlFiles = glob.sync('src/**/*.html').reduce((acc, file) => {
  const name = file.split('/').pop().replace('.html', '');
  acc[name] = resolve(__dirname, file);
  return acc;
}, {});

export default defineConfig({
  root: resolve(__dirname, 'src'),
  resolve: {
    alias: {
      '@images': resolve(__dirname, './src/assets/images'),
    },
  },
  plugins: [
    {
      name: 'pre-build',
      buildStart: async () => {
        // Your pre-build logic here
        console.log('Running pre-build tasks...');
        // Example: Generate files, validate configs, etc.
      },
    },
    // Image Optimization
    ViteImageOptimizer({
      // Test regex for matching files
      test: /\.(jpe?g|png|gif|webp|svg)$/i,
      // Size optimization
      size: {
        width: 2048, // Maximum width
        height: 2048, // Maximum height
        resize: true,
      },
      // Generate multiple sizes
      responsive: {
        sizes: [320, 640, 960, 1200],
        // Generate srcset automatically
        generateSrcset: true,
      },
      // Quality optimization
      quality: {
        jpg: 80,
        jpeg: 80,
        png: 80,
        webp: 80,
      },
      // Convert to WebP
      webp: {
        quality: 80,
        // Create WebP versions alongside originals
        create: true,
      },
    }),

    // Gzip/Brotli Compression
    viteCompression({
      verbose: false,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),

    // HTML Minification and Variables
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {},
      },
    }),
  ],

  // Build Configuration
  build: {
    target: 'es2015',
    outDir: '../dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    cssCodeSplit: true,
    sourcemap: true,
    rollupOptions: {
      input: htmlFiles,
      output: {
        manualChunks: {
          vendor: ['jquery'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: !SHOULD_SHOW_CONSOLE_LOG,
        drop_debugger: !SHOULD_SHOW_CONSOLE_LOG,
      },
    },
  },

  // CSS Configuration
  css: {
    devSourcemap: true,
    modules: {
      scopeBehavior: 'local',
      localsConvention: 'camelCase',
    },
    postcss: {
      plugins: [
        // Import plugins properly for ESM
        (await import('autoprefixer')).default,
        (await import('cssnano')).default({
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true,
              },
            },
          ],
        }),
      ],
    },
  },

  // Server Configuration
  server: {
    port: 3000,
    open: true,
    cors: true,
    hmr: {
      overlay: true,
    },
  },
});
