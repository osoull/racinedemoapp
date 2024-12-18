import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"

// Using dynamic import for ESM module
const getComponentTagger = async () => {
  const { componentTagger } = await import("lovable-tagger")
  return componentTagger
}

export default defineConfig(async ({ mode }) => {
  const tagger = mode === 'development' ? await getComponentTagger() : null

  return {
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
      mode === 'development' && tagger,
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})