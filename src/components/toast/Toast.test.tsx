import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast } from "./Toast";
import type { ToastOptions } from "./Toast";

function Trigger(options: Partial<ToastOptions>) {
  const { toast } = useToast();
  return (
    <button type="button" onClick={() => toast({ title: "Saved", ...options })}>
      Notify
    </button>
  );
}

function renderToasts(options: Partial<ToastOptions> = {}, duration = 5000) {
  render(
    <ToastProvider duration={duration}>
      <Trigger {...options} />
    </ToastProvider>,
  );
}

const region = () => screen.getByRole("region", { name: "Notifications" });
const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

describe("Toast", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  const setup = () => userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  it("renders persistent live regions before any toast appears", () => {
    renderToasts();
    const lists = within(region()).getAllByRole("list", { hidden: true });
    expect(lists.map((l) => l.getAttribute("aria-live"))).toEqual(["polite", "assertive"]);
    expect(lists.every((l) => l.children.length === 0)).toBe(true);
  });

  it("adds toasts to the polite region and errors to the assertive one", async () => {
    const user = setup();
    renderToasts({ description: "All changes stored" });
    await user.click(screen.getByRole("button", { name: "Notify" }));
    const [polite, assertive] = within(region()).getAllByRole("list");
    expect(polite).toHaveTextContent("SavedAll changes stored");
    expect(assertive).toBeEmptyDOMElement();
  });

  it("routes error toasts to the assertive region", async () => {
    const user = setup();
    renderToasts({ tone: "error", title: "Upload failed" });
    await user.click(screen.getByRole("button", { name: "Notify" }));
    const assertive = region().querySelector('[aria-live="assertive"]')!;
    expect(assertive).toHaveTextContent("Upload failed");
  });

  it("dismisses itself after the duration", async () => {
    const user = setup();
    renderToasts({}, 3000);
    await user.click(screen.getByRole("button", { name: "Notify" }));
    expect(screen.getByText("Saved")).toBeInTheDocument();
    advance(3000);
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });

  it("pauses while hovered and resumes with the remaining time", async () => {
    const user = setup();
    renderToasts({}, 3000);
    await user.click(screen.getByRole("button", { name: "Notify" }));
    advance(1000);
    await user.hover(screen.getByText("Saved"));
    advance(10_000);
    expect(screen.getByText("Saved")).toBeInTheDocument();
    await user.unhover(screen.getByText("Saved"));
    advance(1500);
    expect(screen.getByText("Saved")).toBeInTheDocument();
    advance(600);
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });

  it("pauses while focus is inside and can be dismissed by keyboard", async () => {
    const user = setup();
    renderToasts({}, 2000);
    await user.click(screen.getByRole("button", { name: "Notify" }));
    await user.unhover(screen.getByRole("button", { name: "Notify" }));
    await user.tab();
    const dismiss = screen.getByRole("button", { name: "Dismiss notification" });
    expect(dismiss).toHaveFocus();
    advance(10_000);
    expect(screen.getByText("Saved")).toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });

  it("keeps toasts with an infinite duration", async () => {
    const user = setup();
    renderToasts({ duration: Infinity });
    await user.click(screen.getByRole("button", { name: "Notify" }));
    advance(60_000);
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  it("throws a helpful error outside the provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Trigger />)).toThrow("useToast must be used inside <ToastProvider>");
  });

  it("has no axe violations with toasts showing", async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    renderToasts({ description: "Details" });
    await user.click(screen.getByRole("button", { name: "Notify" }));
    await expect(document.body).toHaveNoAxeViolations();
  });
});
