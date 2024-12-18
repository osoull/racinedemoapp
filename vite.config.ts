import { defineConfig, UserConfig, ConfigEnv, PluginOption } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"

// Using dynamic import for ESM module
const getComponentTagger = async () => {
  const { componentTagger } = await import("lovable-tagger")
  return componentTagger()
}

export default defineConfig(async ({ mode }: ConfigEnv): Promise<UserConfig> => {
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
      tagger,
    ].filter(Boolean) as PluginOption[],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})