import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom", // use jsdom environment for testing
    globals: true, // use global variables like describe, it, expect
    setupFiles: "./tests/setup.ts", // this setup runs before each test file
  },
});
