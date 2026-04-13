import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const pages = [
  { path: "", heading: "ui-kit" },
  { path: "button", heading: "Button" },
  { path: "text-field", heading: "TextField" },
  { path: "checkbox-switch", heading: "Checkbox and Switch" },
  { path: "tabs", heading: "Tabs" },
  { path: "dialog", heading: "Dialog" },
  { path: "tooltip", heading: "Tooltip" },
  { path: "toast", heading: "Toast" },
  { path: "select", heading: "Select" },
  { path: "theming", heading: "Theming" },
];

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

async function expectNoViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
  expect(summary).toEqual([]);
}

for (const theme of ["light", "dark"] as const) {
  test.describe(`${theme} theme`, () => {
    test.use({ colorScheme: theme });

    for (const { path, heading } of pages) {
      test(`/${path} has no axe violations`, async ({ page }) => {
        const errors = collectConsoleErrors(page);
        await page.goto(`/#/${path}`);
        await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
        await expectNoViolations(page);
        expect(errors).toEqual([]);
      });
    }
  });
}

test("the dialog traps focus, closes on Escape and restores focus", async ({ page }) => {
  await page.goto("/#/dialog");
  const trigger = page.getByRole("button", { name: "Edit profile" });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Edit profile" });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Display name" })).toBeFocused();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

  // Tab well past the number of focusable elements; focus must never leave the dialog.
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  }
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Shift+Tab");
    expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  }

  await expectNoViolations(page);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("the dialog wraps from the last element to the first", async ({ page }) => {
  await page.goto("/#/dialog");
  await page.getByRole("button", { name: "Edit profile" }).click();
  await page.getByRole("button", { name: "Save" }).focus();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Close" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "Save" })).toBeFocused();
});
