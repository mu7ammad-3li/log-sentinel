import { defineConfig } from "vitest/config";
import { includes } from "zod";

export default defineConfig({
  test: {
    globals: false,
    environment: "node",
    include: ["tests/**/**.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["node_modules", "test", "dist"],
    },
  },
});
