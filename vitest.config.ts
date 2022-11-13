import { resolve } from "pathe";

/// <reference types="vitest" />
import { defineConfig } from "vite";

// used for testing, library code uses TSUP to build exports
export default defineConfig({
  resolve: {
    dedupe: ["vue"],
    alias: {
      "~/": `${resolve(import.meta.url, "src")}/`,
      "src/": `${resolve(import.meta.url, "src")}/`,
    },
  },
  test: {
    dir: "test",
    api: {
      host: "0.0.0.0",
    },
  },
  plugins: [],
});
