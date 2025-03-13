import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    base: "/",
    server: {
      port: 3000,
      open: true, // 모든 네트워크 인터페이스에서 접근 허용
    },
    build: {
      outDir: "dist", // 빌드 출력 디렉토리
      assetsDir: "assets",
      emptyOutDir: true,
      minify: mode === "production" ? "terser" : "esbuild",
      terserOptions:
        mode === "production"
          ? {
              compress: {
                drop_console: true,
                drop_debugger: true,
              },
            }
          : undefined,
      rollupOptions: {
        output: {
          // MIME 타입 관련 설정
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`,
          manualChunks: {
            vendor: [
              "react",
              "react-dom",
              "react-router-dom",
              "@mui/material",
              "@emotion/react",
              "@emotion/styled",
            ],
          },
        },
      },
    },
    // MIME 타입 헤더 설정
    optimizeDeps: {
      esbuildOptions: {
        target: "es2020",
      },
    },
  };
});
