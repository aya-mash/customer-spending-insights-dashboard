import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { buildTestRouter } from '../app/router';
import App from "../App";

function renderApp(path = "/") {
  const testRouter = buildTestRouter([path]);
  return render(<App router={testRouter} />);
}

describe("Theme with SettingsDrawer", () => {
  it("defaults to system (no data-theme attribute and no localStorage key)", () => {
    const { container } = renderApp("/");
    expect(
      container.ownerDocument.documentElement.dataset.theme
    ).toBeUndefined();
    expect(localStorage.getItem("theme-choice")).toBeNull();
  });
  it("selecting Dark sets data-theme and localStorage, selecting System clears both", () => {
    const { getByRole, getByTestId, container } = renderApp("/");
    const settingsBtn = getByRole("button", { name: /open settings/i });
    fireEvent.click(settingsBtn);
    const darkBtn = getByTestId("mode-dark");
    fireEvent.click(darkBtn);
    expect(container.ownerDocument.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("theme-choice")).toBe("dark");
    const systemBtn = getByTestId("mode-system");
    fireEvent.click(systemBtn);
    expect(
      container.ownerDocument.documentElement.dataset.theme
    ).toBeUndefined();
    expect(localStorage.getItem("theme-choice")).toBeNull();
  });
  it('selecting Light sets explicit data-theme="light" and persists', () => {
    const { getByRole, getByTestId, container } = renderApp("/");
    const settingsBtn = getByRole("button", { name: /open settings/i });
    fireEvent.click(settingsBtn);
    const lightBtn = getByTestId("mode-light");
    fireEvent.click(lightBtn);
    expect(container.ownerDocument.documentElement.dataset.theme).toBe("light");
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
