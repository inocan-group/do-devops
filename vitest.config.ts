/// <reference types="vitest" />
import { defineConfig } from "vite";
import { resolve } from "pathe";
import { fileURLToPath } from "node:url";

// used for testing, library code uses TSUP to build exports
export default defineConfig({
  resolve: {
    dedupe: ["vue"],
    alias: {
      "~/": `${resolve(fileURLToPath(new URL(".", import.meta.url)), "src")}/`,
      "src/": `${resolve(fileURLToPath(new URL(".", import.meta.url)), "src")}/`,
      "test/": `${resolve(fileURLToPath(new URL(".", import.meta.url)), "test")}/`,
    },
  },
  plugins: [],
});
