import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/isitBlog/", // 저장소 이름
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist", // 빌드 출력 디렉토리
    assetsDir: "assets",
    emptyOutDir: true,
  },
});
