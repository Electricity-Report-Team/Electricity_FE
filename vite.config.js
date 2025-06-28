import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr'; // ✅ 반드시 추가

export default defineConfig({
  plugins: [react(), svgr()], // ✅ 순서 중요하지 않음

});
