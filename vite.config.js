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
      '@': '/src',
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

    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|webp|svg)$/i,
      include: ['src/assets/images/**/*'],
      exclude: ['node_modules/**/*'],
      logStats: true,
      jpg: {
        quality: 75,
        progressive: true,
      },
      png: {
        quality: 75,
        optimizationLevel: 3,
      },
      webp: {
        quality: 75,
        lossless: false,
        nearLossless: false,
      },
      gif: {
        optimizationLevel: 3,
      },
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
                cleanupNumericValues: {
                  floatPrecision: 2,
                },
              },
            },
          },
        ],
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
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: !SHOULD_SHOW_CONSOLE_LOG,
        drop_debugger: !SHOULD_SHOW_CONSOLE_LOG,
      },
    },
    assetsInclude: ['**/*.jpg', '**/*.png', '**/*.gif', '**/*.webp', '**/*.svg'],
    assetsInlineLimit: 4096,
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
