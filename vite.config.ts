import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // isitBlog에서 isITinnovation으로 수정
  server: {
    port: 3000,
    open: true, // 모든 네트워크 인터페이스에서 접근 허용
  },
  build: {
    outDir: "dist", // 빌드 출력 디렉토리
    assetsDir: "assets",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // MIME 타입 관련 설정
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
      },
    },
  },
  // MIME 타입 헤더 설정
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
    },
  },
});
