import axe from "axe-core";
import type { AxeResults, RunOptions } from "axe-core";

const defaults: RunOptions = {
  rules: {
    // Components are rendered in isolation, not inside a full page with landmarks.
    region: { enabled: false },
    // jsdom has no layout engine, so contrast is checked in the browser tests instead.
    "color-contrast": { enabled: false },
  },
};

/** Runs axe-core against a container and returns the violations. */
export async function runAxe(
  container: Element = document.body,
  options: RunOptions = {},
): Promise<AxeResults["violations"]> {
  const results = await axe.run(container, {
    ...defaults,
    ...options,
    rules: { ...defaults.rules, ...options.rules },
  });
  return results.violations;
}

export function formatViolations(violations: AxeResults["violations"]): string {
  return violations
    .map(
      (v) =>
        `${v.id} (${v.impact ?? "unknown"}): ${v.help}\n` +
        v.nodes.map((n) => `  - ${n.html}`).join("\n"),
    )
    .join("\n\n");
}
