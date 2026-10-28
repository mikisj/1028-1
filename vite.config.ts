import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    // 【修正重點】
    // GitHub Pages 專案網站的網址含子路徑（https://mikisj.github.io/1028-1/），
    // 建置時必須設定 base，index.html 才能正確載入 JS/CSS；否則會去網站根路徑
    // 找資源而 404，畫面一片空白。
    // 做法：只在部署管線（.github/workflows/deploy.yml）設定環境變數
    // VITE_BASE_PATH=/1028-1/。本機開發與 AI Studio 預覽沒有這個變數，
    // 仍為 '/'，行為完全不變。
    base: process.env.VITE_BASE_PATH || '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
