import { defineConfig, UserConfig, ConfigEnv, PluginOption } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import { componentTagger } from "lovable-tagger"

export default defineConfig(({ mode }: ConfigEnv): UserConfig => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist",
    sourcemap: mode === "development",
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean) as PluginOption[],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))