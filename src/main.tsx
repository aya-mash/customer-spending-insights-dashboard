import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Amplify } from "aws-amplify";
import "./styles/tokens.css";
import "./styles/base.css";
import "./i18n/config";
import { config } from "./config/env";
import { logger } from "./utils/logger";
import { initWebVitals } from "./utils/webVitals";
import { initSentry } from "./utils/sentry";
import { registerServiceWorker } from "./utils/pwa";
import { amplifyConfig } from "./config/amplifyConfig.ts";

// CRITICAL: Configure Amplify synchronously BEFORE any dynamic imports
// This ensures AWS SDK is initialized before any component using AWS hooks loads
Amplify.configure(amplifyConfig);

// Initialize Sentry error tracking (production only)
initSentry();

// Register PWA service worker
registerServiceWorker();

// Initialize Web Vitals performance monitoring
initWebVitals();

// Async initialization and app rendering
async function initializeApp() {
  // Enable MSW in development or when explicitly enabled
  if (config.enableMocks) {
    try {
      const { worker } = await import("./mocks/browser.ts");
      await worker.start({ onUnhandledRequest: "bypass" });
      logger.log("[MSW] Mock Service Worker started");
    } catch (error) {
      logger.warn("[MSW] Failed to start Service Worker:", error);
    }
  }

  // Dynamically import App AFTER Amplify is configured
  // This ensures all AWS Amplify components/hooks are loaded after configuration
  const { default: App } = await import("./App");

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

// Start the app with top-level await
try {
  await initializeApp();
} catch (error) {
  logger.error("[App] Failed to initialize:", error);
  // Show a user-friendly error message
  document.getElementById("root")!.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; text-align: center;">
      <div>
        <h1 style="color: #ef4444; margin-bottom: 16px;">Application Error</h1>
        <p style="color: #6b7280; margin-bottom: 24px;">Failed to initialize the application. Please refresh the page.</p>
        <button onclick="location.reload()" style="padding: 12px 24px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    </div>
  `;
}
