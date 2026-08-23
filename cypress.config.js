import { defineConfig } from "cypress";
import os from "os";
import path from "path";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:5173",
    testIsolation: false,
    // Kept outside the project tree on purpose. Cypress clears and recreates
    // this folder at the start of every run, and the Vite dev server watches
    // the project -- so when it lives at cypress/downloads that housekeeping
    // reads as a source change and triggers a full page reload, blanking the
    // app and failing whichever assertion is in flight. No test reads from
    // here, so its location is free to move.
    downloadsFolder: path.join(os.tmpdir(), "codelabz-cypress-downloads")
  },
  projectId: process.env.CYPRESS_PROJECT_ID
  // uncomment these after the secrets are configured
  // record: true, // Enable test recording
  // key: process.env.CYPRESS_RECORD_KEY // Cypress record key
});
