import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("labels the input with the visible label", () => {
    render(<TextField label="Email" />);
    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
  });

  it("links the hint with aria-describedby", () => {
    render(<TextField label="Email" hint="We never share it." />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAccessibleDescription("We never share it.");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("marks the input invalid and describes it with hint and error", () => {
    render(<TextField label="Email" hint="Work address" error="Enter a valid email" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Work address Enter a valid email");
  });

  it("keeps a caller-supplied aria-describedby", () => {
    render(
      <>
        <p id="extra">Extra help</p>
        <TextField label="Name" hint="Full name" aria-describedby="extra" />
      </>,
    );
    expect(screen.getByRole("textbox")).toHaveAccessibleDescription("Extra help Full name");
  });

  it("uses the given id and keeps the asterisk out of the name", () => {
    render(<TextField label="City" id="city" required />);
    const input = screen.getByRole("textbox", { name: "City" });
    expect(input).toHaveAttribute("id", "city");
    expect(input).toBeRequired();
  });

  it("accepts typing and focuses from the label", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextField label="Search" onChange={onChange} />);
    await user.click(screen.getByText("Search"));
    expect(screen.getByRole("textbox")).toHaveFocus();
    await user.keyboard("abc");
    expect(screen.getByRole("textbox")).toHaveValue("abc");
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it("gives each instance a unique id", () => {
    render(
      <>
        <TextField label="One" hint="h1" />
        <TextField label="Two" hint="h2" />
      </>,
    );
    const [a, b] = screen.getAllByRole("textbox");
    expect(a!.id).not.toBe(b!.id);
    expect(b).toHaveAccessibleDescription("h2");
  });

  it("has no axe violations with hint and error", async () => {
    const { container } = render(
      <div>
        <TextField label="Email" hint="Work address" />
        <TextField label="Phone" error="Required" required />
      </div>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});
