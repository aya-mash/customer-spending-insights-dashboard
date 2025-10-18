import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "../App";

function renderApp(path = "/") {
  const qc = new QueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  );
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
    const settingsBtn = getByRole("button", { name: /^settings$/i });
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
    const settingsBtn = getByRole("button", { name: /^settings$/i });
    fireEvent.click(settingsBtn);
    const lightBtn = getByTestId("mode-light");
    fireEvent.click(lightBtn);
    expect(container.ownerDocument.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("theme-choice")).toBe("light");
  });
});

describe("Contrast widget gating", () => {
  // FAB should be visible in dev mode, with accessible name 'Toggle contrast checker'.
  it("is visible in dev mode without devtools flag", () => {
    const { getByRole } = renderApp("/");
    expect(getByRole("button", { name: /toggle contrast checker/i })).toBeTruthy();
  });
  it("toggles open (devtools flag still shows)", () => {
    // Provide query param in path for potential future gating logic
    const { getByRole, getByLabelText } = renderApp("/?devtools=1");
    const fab = getByRole("button", { name: /toggle contrast checker/i });
    expect(fab).toBeTruthy();
    fireEvent.click(fab);
    // Panel appears with close button label
    const closeBtn = getByLabelText(/close contrast checker/i);
    expect(closeBtn).toBeTruthy();
    fireEvent.click(closeBtn);
    // FAB remains after closing panel
    expect(getByRole("button", { name: /toggle contrast checker/i })).toBeTruthy();
  });
});
// Negative gating: ensure no stale 'open contrast checker' label remains
it("does not expose deprecated open contrast label", () => {
  const { queryByRole } = renderApp("/");
  expect(queryByRole("button", { name: /open contrast checker/i })).toBeNull();
});
