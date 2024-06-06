import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:5173",
    testIsolation: false
  },
  projectId: import.meta.env.CYPRESS_PROJECT_ID,
  record: true, // Enable test recording
  key: import.meta.env.CYPRESS_RECORD_KEY // Cypress record key
});
