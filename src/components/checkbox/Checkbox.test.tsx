import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("is a labelled native checkbox", () => {
    render(<Checkbox label="Email me" description="At most once a week" />);
    const box = screen.getByRole("checkbox", { name: "Email me" });
    expect(box).toHaveAccessibleDescription("At most once a week");
    expect(box).not.toBeChecked();
  });

  it("toggles with Space and with a label click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Agree" onChange={onChange} />);
    const box = screen.getByRole("checkbox");
    await user.tab();
    expect(box).toHaveFocus();
    await user.keyboard(" ");
    expect(box).toBeChecked();
    await user.click(screen.getByText("Agree"));
    expect(box).not.toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("reports the mixed state", () => {
    const { rerender } = render(<Checkbox label="All rows" indeterminate readOnly />);
    expect(screen.getByRole("checkbox")).toBePartiallyChecked();
    rerender(<Checkbox label="All rows" readOnly />);
    expect(screen.getByRole("checkbox")).not.toBePartiallyChecked();
  });

  it("forwards the ref to the input", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Checkbox label="Ref" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole("checkbox"));
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <Checkbox label="One" description="Details" />
        <Checkbox label="Two" disabled />
        <Checkbox label="Three" indeterminate readOnly />
      </div>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});
