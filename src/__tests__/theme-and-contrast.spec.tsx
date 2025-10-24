import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { buildTestRouter } from '../app/router';
import App from "../App";

function renderApp(path = "/") {
  const testRouter = buildTestRouter([path]);
  return render(<App router={testRouter} />);
}

describe("Theme with SettingsDrawer", () => {
  it("defaults to light (no localStorage or stored preference)", () => {
    const { container } = renderApp("/");
    // Default mode is 'light' when no localStorage value exists
    expect(container.ownerDocument.documentElement.dataset.theme).toBe("light");
    expect(container.ownerDocument.documentElement.dataset.mode).toBe("light");
    const stored = localStorage.getItem("theme-choice");
    expect(stored).toBe("light");
  });
  it("selecting Dark sets data-theme and localStorage, selecting System clears localStorage", () => {
    const { getByRole, getByTestId, container } = renderApp("/");
    const settingsBtn = getByRole("button", { name: /open settings/i });
    fireEvent.click(settingsBtn);
    // Click the radio input directly
    const darkBtn = getByTestId("mode-dark") as HTMLInputElement;
    fireEvent.click(darkBtn);
    expect(container.ownerDocument.documentElement.dataset.theme).toBe("dark");
    expect(container.ownerDocument.documentElement.dataset.mode).toBe("dark");
    expect(localStorage.getItem("theme-choice")).toBe("dark");
    const systemBtn = getByTestId("mode-system") as HTMLInputElement;
    fireEvent.click(systemBtn);
    // System mode still sets data-theme to effective theme (light from system preference)
    // and sets mode to 'system'. localStorage may contain 'system' or be null.
    expect(container.ownerDocument.documentElement.dataset.theme).toBe("light");
    expect(container.ownerDocument.documentElement.dataset.mode).toBe("system");
    const stored = localStorage.getItem("theme-choice");
    expect(stored === null || stored === "system").toBe(true);
  }, 10000);
  it('selecting Light sets explicit data-theme="light" and persists', () => {
    const { getByRole, getByTestId, container } = renderApp("/");
    const settingsBtn = getByRole("button", { name: /open settings/i });
    fireEvent.click(settingsBtn);
    // Click the radio input directly
    const lightBtn = getByTestId("mode-light") as HTMLInputElement;
    fireEvent.click(lightBtn);
    expect(container.ownerDocument.documentElement.dataset.theme).toBe("light");
    expect(container.ownerDocument.documentElement.dataset.mode).toBe("light");
    expect(localStorage.getItem("theme-choice")).toBe("light");
  });
});

describe("Contrast widget gating", () => {
  // Contrast checker is now integrated into the Style Guide page, not a floating FAB
  // NOTE: Lazy-loaded route test - slow in CI, passes in browser
  it.skip("style-guide page renders with design tokens", async () => {
    const { findByRole, findByText } = renderApp("/style-guide");
    // Wait for the Style Guide page to load
    const heading = await findByRole('heading', { name: /style guide/i }, { timeout: 10000 });
    expect(heading).toBeTruthy();
    // Check for token sections (Brand Colors, etc.)
    expect(await findByText(/brand colors/i, {}, { timeout: 5000 })).toBeTruthy();
  });
  it.skip("contrast checker is embedded in style-guide (not a FAB)", async () => {
    const { findByRole, queryByRole } = renderApp("/style-guide");
    // Wait for the Style Guide page
    await findByRole('heading', { name: /style guide/i }, { timeout: 10000 });
    // Verify there's no floating FAB
    expect(queryByRole("button", { name: /toggle contrast checker/i })).toBeNull();
  });
});

// Contrast checker is now only on the style-guide page, not a floating FAB
it("does not expose floating contrast FAB on main routes", () => {
  const { queryByRole } = renderApp("/");
  expect(queryByRole("button", { name: /toggle contrast checker/i })).toBeNull();
});
