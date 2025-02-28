import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // 반드시 '/'로 설정
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
