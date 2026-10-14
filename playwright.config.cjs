const { defineConfig } = require('@playwright/test');
const port = process.env.TEST_PORT || '18763';

module.exports = defineConfig({
  testDir: './tests',
  timeout: 15000,
  workers: 2,
  use: {
    baseURL: 'http://127.0.0.1:' + port,
    browserName: 'chromium',
    ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {})
  },
  webServer: {
    command: 'python3 -m http.server ' + port + ' --bind 127.0.0.1',
    url: 'http://127.0.0.1:' + port,
    reuseExistingServer: false
  }
});
