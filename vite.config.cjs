const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react'); // 如果是 React 项目
const tsconfigPaths = require('vite-tsconfig-paths');

module.exports = defineConfig({
  plugins: [
    react(), // 如果是 React 项目
    tsconfigPaths(),
  ],
});