import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// The docs import the library from source, so examples always match the code under test.
export default defineConfig({
  root: here("."),
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@mdjamilh/ui-kit/styles.css", replacement: here("../src/styles/index.css") },
      { find: "@mdjamilh/ui-kit", replacement: here("../src/index.ts") },
    ],
  },
  build: {
    outDir: here("dist"),
    emptyOutDir: true,
  },
  preview: {
    port: 47230,
    strictPort: true,
  },
});
