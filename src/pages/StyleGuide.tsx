/**
 * NEOMORPHIC DESIGN SYSTEM - STYLE GUIDE
 * Complete component catalog and usage documentation
 * Single source of truth for the Neomorphic Design System
 */

import { useState, useEffect } from "react";
import {
  PageLayout,
  Card,
  Stack,
  Grid,
  Heading,
  Text,
  Button,
  TextField,
  Select,
  Badge,
  Divider,
  Tabs,
} from "../design-system/components/index";
import { Palette, Info } from "lucide-react";
import { ContrastCheckerPanel } from "../design-system/components/ContrastCheckerPanel";
import { useTheme } from "../design-system";

export function StyleGuide() {
  const [showContrastChecker, setShowContrastChecker] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "components" | "tokens"
  >("overview");
  const [demoTab, setDemoTab] = useState("overview");
  const { isMobile } = useTheme();

  // Close dialog on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showContrastChecker) {
        setShowContrastChecker(false);
      }
    };
    globalThis.addEventListener("keydown", handleEscape);
    return () => globalThis.removeEventListener("keydown", handleEscape);
  }, [showContrastChecker]);

  return (
    <PageLayout title="Design System">
      <div style={{ maxWidth: "100%", overflowX: "hidden" }}>
        <Stack spacing={8}>
          {/* Header */}
          <Card padding={8}>
            <Stack spacing={4}>
              <Heading level={1}>Neomorphic Design System</Heading>
              <Text variant="body" color="muted">
                A unified soft UI design system with embossed and debossed
                elements. Light source from top-left creates subtle depth
                through dual shadows.
              </Text>
            </Stack>
          </Card>

          {/* Navigation Tabs */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              padding: "8px",
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-neumorphic-inset)",
            }}
          >
            {(["overview", "components", "tokens"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  backgroundColor:
                    activeTab === tab ? "var(--color-surface)" : "transparent",
                  boxShadow:
                    activeTab === tab
                      ? "var(--shadow-neumorphic-sm)"
                      : "var(--shadow-neumorphic-pressed)",
                  transform: activeTab === tab ? "translateY(-1px)" : "none",
                  color:
                    activeTab === tab
                      ? "var(--color-text-strong)"
                      : "var(--color-text-muted)",
                  fontWeight: activeTab === tab ? 600 : 400,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <Stack spacing={6}>
              {/* Design Principles */}
              <Card padding={6}>
                <Stack spacing={4}>
                  <Heading level={2}>Design Principles</Heading>
                  <Grid columns={{ mobile: 1, tablet: 2 }} gap={4}>
                    <div>
                      <Text
                        variant="bodyLg"
                        style={{ fontWeight: 600, marginBottom: "8px" }}
                      >
                        Monochromatic Base
                      </Text>
                      <Text variant="body" color="muted">
                        Elements share the same base color as the background
                        (whitish #EBF0F5 in light, dark charcoal in dark mode)
                        creating a cohesive molded appearance.
                      </Text>
                    </div>
                    <div>
                      <Text
                        variant="bodyLg"
                        style={{ fontWeight: 600, marginBottom: "8px" }}
                      >
                        Dual Shadow Technique
                      </Text>
                      <Text variant="body" color="muted">
                        Light shadow (white) on top-left, dark shadow
                        (gray-blue) on bottom-right simulates a light source
                        creating depth without harsh borders.
                      </Text>
                    </div>
                    <div>
                      <Text
                        variant="bodyLg"
                        style={{ fontWeight: 600, marginBottom: "8px" }}
                      >
                        Embossed (Raised)
                      </Text>
                      <Text variant="body" color="muted">
                        Outward shadows (--shadow-neumorphic-sm/md/lg) make
                        elements appear to protrude from the surface. Use for
                        buttons, cards, navigation.
                      </Text>
                    </div>
                    <div>
                      <Text
                        variant="bodyLg"
                        style={{ fontWeight: 600, marginBottom: "8px" }}
                      >
                        Debossed (Recessed)
                      </Text>
                      <Text variant="body" color="muted">
                        Inset shadows (--shadow-neumorphic-inset/pressed) make
                        elements appear pressed into the surface. Use for
                        inputs, inactive tabs, containers.
                      </Text>
                    </div>
                  </Grid>
                </Stack>
              </Card>

              {/* Depth Scale */}
              <Card padding={6}>
                <Stack spacing={4}>
                  <Heading level={2}>Neomorphic Depth Scale</Heading>
                  <Text variant="body" color="muted">
                    Three elevation levels for raised elements, two for recessed
                    elements:
                  </Text>
                  <Grid columns={{ mobile: 1, tablet: 3 }} gap={4}>
                    <div
                      style={{
                        padding: "32px",
                        borderRadius: "var(--radius-lg)",
                        backgroundColor: "var(--color-surface)",
                        boxShadow: "var(--shadow-neumorphic-sm)",
                        textAlign: "center",
                      }}
                    >
                      <Text variant="body" style={{ fontWeight: 600 }}>
                        Small (sm)
                      </Text>
                      <Text variant="bodySm" color="muted">
                        Subtle cards, chips
                      </Text>
                    </div>
                    <div
                      style={{
                        padding: "32px",
                        borderRadius: "var(--radius-lg)",
                        backgroundColor: "var(--color-surface)",
                        boxShadow: "var(--shadow-neumorphic-md)",
                        textAlign: "center",
                      }}
                    >
                      <Text variant="body" style={{ fontWeight: 600 }}>
                        Medium (md)
                      </Text>
                      <Text variant="bodySm" color="muted">
                        Buttons, panels
                      </Text>
                    </div>
                    <div
                      style={{
                        padding: "32px",
                        borderRadius: "var(--radius-lg)",
                        backgroundColor: "var(--color-surface)",
                        boxShadow: "var(--shadow-neumorphic-lg)",
                        textAlign: "center",
                      }}
                    >
                      <Text variant="body" style={{ fontWeight: 600 }}>
                        Large (lg)
                      </Text>
                      <Text variant="bodySm" color="muted">
                        Modals, headers
                      </Text>
                    </div>
                  </Grid>
                  <Grid columns={{ mobile: 1, tablet: 2 }} gap={4}>
                    <div
                      style={{
                        padding: "32px",
                        borderRadius: "var(--radius-lg)",
                        backgroundColor: "var(--color-surface)",
                        boxShadow: "var(--shadow-neumorphic-inset)",
                        textAlign: "center",
                      }}
                    >
                      <Text variant="body" style={{ fontWeight: 600 }}>
                        Inset
                      </Text>
                      <Text variant="bodySm" color="muted">
                        Text fields, containers
                      </Text>
                    </div>
                    <div
                      style={{
                        padding: "32px",
                        borderRadius: "var(--radius-lg)",
                        backgroundColor: "var(--color-surface)",
                        boxShadow: "var(--shadow-neumorphic-pressed)",
                        textAlign: "center",
                      }}
                    >
                      <Text variant="body" style={{ fontWeight: 600 }}>
                        Pressed
                      </Text>
                      <Text variant="bodySm" color="muted">
                        Active/pressed states
                      </Text>
                    </div>
                  </Grid>
                </Stack>
              </Card>

              {/* Shape Examples */}
              <Card padding={6}>
                <Stack spacing={4}>
                  <Heading level={2}>Shape Variants</Heading>
                  <Grid columns={{ mobile: 2, tablet: 4 }} gap={4}>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          margin: "0 auto 12px",
                          borderRadius: "50%",
                          backgroundColor: "var(--color-surface)",
                          boxShadow: "var(--shadow-neumorphic-md)",
                        }}
                      />
                      <Text variant="bodySm" color="muted">
                        Circle
                      </Text>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          margin: "0 auto 12px",
                          borderRadius: "var(--radius-md)",
                          backgroundColor: "var(--color-surface)",
                          boxShadow: "var(--shadow-neumorphic-md)",
                        }}
                      />
                      <Text variant="bodySm" color="muted">
                        Rounded
                      </Text>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          margin: "0 auto 12px",
                          borderRadius: "50%",
                          backgroundColor: "var(--color-surface)",
                          boxShadow: "var(--shadow-neumorphic-inset)",
                        }}
                      />
                      <Text variant="bodySm" color="muted">
                        Inset Circle
                      </Text>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          margin: "0 auto 12px",
                          borderRadius: "var(--radius-md)",
                          backgroundColor: "var(--color-surface)",
                          boxShadow: "var(--shadow-neumorphic-inset)",
                        }}
                      />
                      <Text variant="bodySm" color="muted">
                        Inset Square
                      </Text>
                    </div>
                  </Grid>
                </Stack>
              </Card>
            </Stack>
          )}

          {/* Components Tab */}
          {activeTab === "components" && (
            <Stack spacing={6}>
              {/* Buttons */}
              <Card padding={6}>
                <Stack spacing={4}>
                  <Heading level={2}>Buttons</Heading>
                  <Text variant="body" color="muted">
                    Raised appearance with hover elevation. Active state uses
                    pressed shadow.
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <Button variant="primary" size="medium">
                      Primary
                    </Button>
                    <Button variant="secondary" size="medium">
                      Secondary
                    </Button>
                    <Button variant="ghost" size="medium">
                      Ghost
                    </Button>
                    <Button variant="primary" size="small">
                      Small
                    </Button>
                    <Button variant="primary" size="large">
                      Large
                    </Button>
                    <Button variant="primary" size="medium" disabled>
                      Disabled
                    </Button>
                  </div>
                  <Divider />
                  <Stack spacing={2}>
                    <Text variant="bodySm" style={{ fontWeight: 600 }}>
                      States
                    </Text>
                    <Text variant="bodySm" color="muted">
                      • Default: --shadow-neumorphic-sm
                      <br />
                      • Hover: --shadow-neumorphic-md + translateY(-1px)
                      <br />
                      • Active/Pressed: --shadow-neumorphic-pressed
                      <br />• Focus: --shadow-neumorphic-ring (outline)
                    </Text>
                  </Stack>
                </Stack>
              </Card>

              {/* Inputs */}
              <Card padding={6}>
                <Stack spacing={4}>
                  <Heading level={2}>Text Fields & Select</Heading>
                  <Text variant="body" color="muted">
                    Recessed appearance creates natural input feel. Focus adds
                    subtle ring.
                  </Text>
                  <Grid columns={{ mobile: 1, tablet: 2 }} gap={4}>
                    <TextField
                      label="Email"
                      placeholder="you@example.com"
                      type="email"
                    />
                    <TextField
                      label="Password"
                      placeholder="••••••••"
                      type="password"
                    />
                    <Select
                      label="Category"
                      options={[
                        { value: "dining", label: "Dining" },
                        { value: "transport", label: "Transportation" },
                        { value: "shopping", label: "Shopping" },
                      ]}
                      value="dining"
                      onChange={() => {}}
                    />
                    <TextField
                      label="Disabled"
                      placeholder="Can't edit"
                      disabled
                    />
                  </Grid>
                  <Divider />
                  <Stack spacing={2}>
                    <Text variant="bodySm" style={{ fontWeight: 600 }}>
                      States
                    </Text>
                    <Text variant="bodySm" color="muted">
                      • Default: --shadow-neumorphic-inset
                      <br />
                      • Focus: --shadow-neumorphic-ring
                      <br />• Disabled: Reduced opacity, no interaction
                    </Text>
                  </Stack>
                </Stack>
              </Card>

              {/* Cards & Panels */}
              <Card padding={6}>
                <Stack spacing={4}>
                  <Heading level={2}>Cards & Panels</Heading>
                  <Text variant="body" color="muted">
                    Soft elevated containers for content grouping. Use small
                    shadow for subtle elevation.
                  </Text>
                  <Grid columns={{ mobile: 1, tablet: 2 }} gap={4}>
                    <Card padding={4}>
                      <Stack spacing={2}>
                        <Heading level={3}>Metric Card</Heading>
                        <Heading level={2}>$1,234.56</Heading>
                        <Text variant="bodySm" color="muted">
                          Monthly spending
                        </Text>
                      </Stack>
                    </Card>
                    <Card padding={4}>
                      <Stack spacing={2}>
                        <Heading level={3}>Info Panel</Heading>
                        <Text variant="body">
                          Cards use --shadow-neumorphic-sm for subtle depth
                          without overwhelming the interface.
                        </Text>
                      </Stack>
                    </Card>
                  </Grid>
                </Stack>
              </Card>

              {/* Badges & Chips */}
              <Card padding={6}>
                <Stack spacing={4}>
                  <Heading level={2}>Badges & Chips</Heading>
                  <Text variant="body" color="muted">
                    Small inline elements with subtle elevation for status and
                    labels.
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <Badge variant="default">Default</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="info">Info</Badge>
                  </div>
                </Stack>
              </Card>

              {/* Navigation */}
              <Card padding={6}>
                <Stack spacing={4}>
                  <Heading level={2}>Navigation</Heading>
                  <Text variant="body" color="muted">
                    Sidebar and bottom navigation use medium elevation. Active
                    states highlighted with color.
                  </Text>
                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "var(--color-surface)",
                      borderRadius: "var(--radius-lg)",
                      boxShadow: "var(--shadow-neumorphic-md)",
                    }}
                  >
                    <Stack spacing={2}>
                      <div
                        style={{
                          padding: "12px 16px",
                          borderRadius: "var(--radius-md)",
                          backgroundColor: "var(--brand-primary)",
                          color: "white",
                          fontWeight: 600,
                        }}
                      >
                        Overview (Active)
                      </div>
                      <div
                        style={{
                          padding: "12px 16px",
                          borderRadius: "var(--radius-md)",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        Insights
                      </div>
                      <div
                        style={{
                          padding: "12px 16px",
                          borderRadius: "var(--radius-md)",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        Transactions
                      </div>
                    </Stack>
                  </div>
                </Stack>
              </Card>

              {/* Tabs */}
              <Card padding={6}>
                <Stack spacing={4}>
                  <Heading level={2}>Tabs</Heading>
                  <Text variant="body" color="muted">
                    Container is debossed (inset), inactive tabs debossed,
                    active tab raised. Supports keyboard navigation (Arrow keys,
                    Home, End).
                  </Text>

                  {/* Interactive Demo */}
                  <div>
                    <Text
                      variant="bodySm"
                      weight="medium"
                      style={{ marginBottom: "12px", display: "block" }}
                    >
                      Interactive Example:
                    </Text>
                    <Tabs
                      items={[
                        { key: "overview", label: "Overview" },
                        { key: "details", label: "Details" },
                        { key: "settings", label: "Settings" },
                      ]}
                      activeTab={demoTab}
                      onChange={(key) => setDemoTab(key)}
                      aria-label="Demo tabs"
                    />
                    <Card padding={4} style={{ marginTop: "16px" }}>
                      <Text variant="body">
                        Active tab: <strong>{demoTab}</strong>
                      </Text>
                    </Card>
                  </div>

                  {/* Usage Example */}
                  <div>
                    <Text
                      variant="bodySm"
                      weight="medium"
                      style={{ marginBottom: "8px", display: "block" }}
                    >
                      Usage:
                    </Text>
                    <pre
                      style={{
                        padding: "16px",
                        backgroundColor: "var(--neutral-100)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "13px",
                        fontFamily: "monospace",
                        overflow: "auto",
                        lineHeight: "1.5",
                      }}
                    >
                      {`<Tabs
  items={[
    { key: 'tab1', label: 'Tab 1' },
    { key: 'tab2', label: 'Tab 2' }
  ]}
  activeTab={activeTab}
  onChange={(key) => setActiveTab(key)}
  aria-label="Navigation tabs"
/>`}
                    </pre>
                  </div>
                </Stack>
              </Card>
            </Stack>
          )}

          {/* Tokens Tab */}
          {activeTab === "tokens" && (
            <Stack spacing={6}>
              {/* Token Reference */}
              <Card padding={6}>
                <Stack spacing={4}>
                  <Heading level={2}>Design Tokens</Heading>
                  <Text variant="body" color="muted">
                    Design tokens are defined in{" "}
                    <code
                      style={{
                        padding: "2px 6px",
                        backgroundColor: "var(--neutral-100)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "13px",
                        fontFamily: "monospace",
                      }}
                    >
                      src/styles/tokens.css
                    </code>
                    . Import and use them in components via the design system.
                  </Text>
                </Stack>
              </Card>

              {/* Shadow Tokens */}
              <Card padding={6}>
                <Stack spacing={4}>
                  <Heading level={3}>Shadow Tokens</Heading>
                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "var(--neutral-50)",
                      borderRadius: "var(--radius-md)",
                      fontFamily: "monospace",
                      fontSize: "13px",
                      lineHeight: 1.6,
                    }}
                  >
                    <div>
                      <strong>Raised (Embossed):</strong>
                    </div>
                    <div>--shadow-neumorphic-sm</div>
                    <div>--shadow-neumorphic-md</div>
                    <div>--shadow-neumorphic-lg</div>
                    <br />
                    <div>
                      <strong>Recessed (Debossed):</strong>
                    </div>
                    <div>--shadow-neumorphic-inset</div>
                    <div>--shadow-neumorphic-pressed</div>
                    <br />
                    <div>
                      <strong>Outline:</strong>
                    </div>
                    <div>--shadow-neumorphic-ring</div>
                  </div>
                </Stack>
              </Card>

              {/* Color Tokens */}
              <Card padding={6}>
                <Stack spacing={4}>
                  <Heading level={3}>Color Tokens</Heading>
                  <Text variant="body" color="muted">
                    Semantic color tokens adapt to light/dark mode
                    automatically.
                  </Text>
                  <Grid columns={{ mobile: 2, tablet: 4 }} gap={3}>
                    {[
                      { name: "Background", token: "--color-bg" },
                      { name: "Surface", token: "--color-surface" },
                      { name: "Text", token: "--color-text" },
                      { name: "Border", token: "--color-border" },
                      { name: "Primary", token: "--brand-primary" },
                      { name: "Success", token: "--color-success" },
                      { name: "Warning", token: "--color-warning" },
                      { name: "Error", token: "--color-error" },
                    ].map(({ name, token }) => (
                      <div key={token}>
                        <div
                          style={{
                            height: "60px",
                            borderRadius: "var(--radius-md)",
                            backgroundColor: `var(${token})`,
                            boxShadow: "var(--shadow-neumorphic-sm)",
                            marginBottom: "8px",
                          }}
                        />
                        <Text variant="bodySm" style={{ fontWeight: 600 }}>
                          {name}
                        </Text>
                        <Text
                          variant="bodySm"
                          color="muted"
                          style={{ fontFamily: "monospace", fontSize: "11px" }}
                        >
                          var({token})
                        </Text>
                      </div>
                    ))}
                  </Grid>
                </Stack>
              </Card>

              {/* Spacing & Radius */}
              <Card padding={6}>
                <Stack spacing={4}>
                  <Heading level={3}>Spacing & Border Radius</Heading>
                  <Grid columns={{ mobile: 1, tablet: 2 }} gap={4}>
                    <Stack spacing={3}>
                      <Text variant="body" style={{ fontWeight: 600 }}>
                        Spacing Scale
                      </Text>
                      <div
                        style={{
                          padding: "16px",
                          backgroundColor: "var(--neutral-50)",
                          borderRadius: "var(--radius-md)",
                          fontFamily: "monospace",
                          fontSize: "13px",
                          lineHeight: 1.8,
                        }}
                      >
                        --sp-1: 4px
                        <br />
                        --sp-2: 8px
                        <br />
                        --sp-3: 12px
                        <br />
                        --sp-4: 16px
                        <br />
                        --sp-6: 24px
                        <br />
                        --sp-8: 32px
                        <br />
                        --sp-12: 48px
                      </div>
                    </Stack>
                    <Stack spacing={3}>
                      <Text variant="body" style={{ fontWeight: 600 }}>
                        Border Radius
                      </Text>
                      <div
                        style={{
                          padding: "16px",
                          backgroundColor: "var(--neutral-50)",
                          borderRadius: "var(--radius-md)",
                          fontFamily: "monospace",
                          fontSize: "13px",
                          lineHeight: 1.8,
                        }}
                      >
                        --radius-sm: 4px
                        <br />
                        --radius-md: 8px
                        <br />
                        --radius-lg: 12px
                        <br />
                        --radius-xl: 16px
                        <br />
                        --radius-2xl: 24px
                        <br />
                        --radius-full: 9999px
                      </div>
                    </Stack>
                  </Grid>
                </Stack>
              </Card>

              {/* Usage Guide */}
              <Card padding={6}>
                <Stack spacing={4}>
                  <Heading level={3}>How to Use Tokens</Heading>
                  <Text variant="body" color="muted">
                    Import tokens from the design system and use them in your
                    components:
                  </Text>
                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "var(--neutral-900)",
                      color: "var(--neutral-50)",
                      borderRadius: "var(--radius-md)",
                      fontFamily: "monospace",
                      fontSize: "13px",
                      lineHeight: 1.6,
                      overflow: "auto",
                    }}
                  >
                    <div>
                      <span style={{ color: "#7DD3FC" }}>import</span> {"{"}{" "}
                      surface, spacing, radius {"}"}{" "}
                      <span style={{ color: "#7DD3FC" }}>from</span>{" "}
                      <span style={{ color: "#86EFAC" }}>
                        '../design-system/tokens'
                      </span>
                      ;
                    </div>
                    <br />
                    <div>
                      <span style={{ color: "#7DD3FC" }}>const</span> styles ={" "}
                      {"{"};
                    </div>
                    <div> backgroundColor: surface.surface,</div>
                    <div> padding: spacing[4],</div>
                    <div> borderRadius: radius.md,</div>
                    <div>
                      {" "}
                      boxShadow:{" "}
                      <span style={{ color: "#86EFAC" }}>
                        'var(--shadow-neumorphic-sm)'
                      </span>
                    </div>
                    <div>{"}"}; </div>
                  </div>
                </Stack>
              </Card>

              {/* Accessibility Note */}
              <Card
                padding={6}
                style={{
                  backgroundColor: "var(--color-info-light)",
                  border: "1px solid var(--color-info)",
                }}
              >
                <Stack spacing={3} direction="horizontal" align="start">
                  <Info
                    size={20}
                    color="var(--color-info)"
                    style={{ flexShrink: 0, marginTop: "2px" }}
                  />
                  <Stack spacing={2}>
                    <Text
                      variant="body"
                      style={{
                        fontWeight: 600,
                        color: "var(--color-info-dark)",
                      }}
                    >
                      Accessibility Guidelines
                    </Text>
                    <Text variant="body" color="muted">
                      • Ensure all interactive elements have :focus-visible
                      rings
                      <br />
                      • Maintain AA contrast (4.5:1) for body text, AAA (7:1)
                      for large text
                      <br />
                      • Test with keyboard navigation and screen readers
                      <br />• Respect prefers-reduced-motion for animations
                    </Text>
                  </Stack>
                </Stack>
              </Card>
            </Stack>
          )}
        </Stack>

        {/* Floating Action Button - Contrast Checker */}
        <button
          onClick={() => setShowContrastChecker(true)}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "var(--brand-primary)",
            color: "white",
            boxShadow: "var(--shadow-neumorphic-lg)",
            cursor: "pointer",
            display: isMobile ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            zIndex: 100,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "var(--shadow-neumorphic-lg)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "var(--shadow-neumorphic-lg)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
          aria-label="Open contrast checker"
        >
          <Palette size={24} />
        </button>

        {/* Contrast Checker Dialog */}
        {showContrastChecker && (
          <>
            <button
              type="button"
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "var(--color-overlay)",
                zIndex: 1300,
                cursor: "pointer",
                border: "none",
                padding: 0,
              }}
              onClick={() => setShowContrastChecker(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape" || e.key === "Esc") {
                  setShowContrastChecker(false);
                }
              }}
              aria-label="Close contrast checker overlay"
            />
            <ContrastCheckerPanel
              onClose={() => setShowContrastChecker(false)}
            />
          </>
        )}
      </div>
    </PageLayout>
  );
}

export default StyleGuide;
