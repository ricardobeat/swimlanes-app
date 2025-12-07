import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./tests",
  maxFailures: 2,
  webServer: {
    command: "CI=true npm run start",
    url: "http://localhost:5173",
    reuseExistingServer: true,
    stdout: "ignore",
    stderr: "pipe",
  },
};

export default config;
