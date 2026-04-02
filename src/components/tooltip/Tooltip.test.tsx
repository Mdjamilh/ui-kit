import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Tooltip } from "./Tooltip";

const bubble = () => screen.getByRole("tooltip", { hidden: true });

describe("Tooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const setup = () => userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  it("describes the trigger even while hidden", () => {
    render(
      <Tooltip content="Copy to clipboard">
        <button type="button">Copy</button>
      </Tooltip>,
    );
    const button = screen.getByRole("button", { name: "Copy" });
    expect(button).toHaveAttribute("aria-describedby", bubble().id);
    expect(button).toHaveAccessibleDescription("Copy to clipboard");
    expect(bubble()).not.toHaveAttribute("data-open");
  });

  it("keeps an existing aria-describedby on the child", () => {
    render(
      <>
        <span id="note">Note</span>
        <Tooltip content="Tip">
          <button type="button" aria-describedby="note">
            Info
          </button>
        </Tooltip>
      </>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-describedby", `note ${bubble().id}`);
  });

  it("shows immediately on keyboard focus and hides on blur", async () => {
    const user = setup();
    render(
      <>
        <Tooltip content="Bold (Ctrl+B)">
          <button type="button">B</button>
        </Tooltip>
        <button type="button">Next</button>
      </>,
    );
    await user.tab();
    expect(bubble()).toHaveAttribute("data-open");
    await user.tab();
    expect(bubble()).not.toHaveAttribute("data-open");
  });

  it("hides on Escape while the trigger keeps focus", async () => {
    const user = setup();
    render(
      <Tooltip content="Help">
        <button type="button">?</button>
      </Tooltip>,
    );
    await user.tab();
    await user.keyboard("{Escape}");
    expect(bubble()).not.toHaveAttribute("data-open");
    expect(screen.getByRole("button")).toHaveFocus();
  });

  it("waits for the delay on hover and stays open over the bubble", async () => {
    const user = setup();
    render(
      <Tooltip content="Archive" delay={300}>
        <button type="button">A</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole("button"));
    expect(bubble()).not.toHaveAttribute("data-open");
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(bubble()).toHaveAttribute("data-open");
    await user.hover(bubble());
    expect(bubble()).toHaveAttribute("data-open");
    await user.unhover(bubble());
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(bubble()).not.toHaveAttribute("data-open");
  });

  it("cancels a pending show when the pointer leaves early", async () => {
    const user = setup();
    render(
      <Tooltip content="Later">
        <button type="button">L</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole("button"));
    await user.unhover(screen.getByRole("button"));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(bubble()).not.toHaveAttribute("data-open");
  });

  it("has no axe violations open or closed", async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    const { container } = render(
      <Tooltip content="Settings">
        <button type="button">S</button>
      </Tooltip>,
    );
    await expect(container).toHaveNoAxeViolations();
    await user.tab();
    await expect(container).toHaveNoAxeViolations();
  });
});
