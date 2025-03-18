import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    base: "/",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@assets": path.resolve(__dirname, "./src/assets"),
      },
    },
    server: {
      port: 3000,
      open: true, // 모든 네트워크 인터페이스에서 접근 허용
      // 개발 환경에서는 프록시 설정을 제거하고 클라이언트 측에서 처리
      // proxy: {
      //   // API 요청을 로컬 개발 서버에서 처리
      //   "/api": {
      //     target: "http://localhost:5000",
      //     changeOrigin: true,
      //     rewrite: (path) => path,
      //     configure: (proxy, _options) => {
      //       proxy.on("error", (err, _req, _res) => {
      //         console.log("프록시 오류:", err);
      //       });
      //       proxy.on("proxyReq", (proxyReq, req, _res) => {
      //         console.log("프록시 요청:", req.method, req.url);
      //       });
      //       proxy.on("proxyRes", (proxyRes, req, _res) => {
      //         console.log(
      //           "프록시 응답:",
      //           req.method,
      //           req.url,
      //           proxyRes.statusCode
      //         );
      //       });
      //     },
      //   },
      // },
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
    // 환경 변수 정의
    define: {
      "import.meta.env.DEV": mode === "development",
    },
  };
});
