import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";
import { formatViolations, runAxe } from "./axe";

afterEach(() => {
  cleanup();
});

expect.extend({
  async toHaveNoAxeViolations(received: Element) {
    const violations = await runAxe(received);
    return {
      pass: violations.length === 0,
      message: () =>
        violations.length === 0
          ? "Expected axe violations, found none"
          : `Expected no axe violations, found ${violations.length}:\n\n${formatViolations(violations)}`,
    };
  },
});

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- must match Vitest's declaration
  interface Matchers<R, T> {
    toHaveNoAxeViolations(): Promise<void>;
  }
}
