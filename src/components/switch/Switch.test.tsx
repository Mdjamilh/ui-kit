import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("exposes role=switch with aria-checked and a name from the label", () => {
    render(<Switch label="Wi-Fi" description="Join known networks" />);
    const sw = screen.getByRole("switch", { name: "Wi-Fi" });
    expect(sw).toHaveAttribute("aria-checked", "false");
    expect(sw).toHaveAccessibleDescription("Join known networks");
  });

  it("toggles with Space and Enter", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="Dark mode" onCheckedChange={onCheckedChange} />);
    const sw = screen.getByRole("switch");
    await user.tab();
    await user.keyboard(" ");
    expect(sw).toBeChecked();
    await user.keyboard("{Enter}");
    expect(sw).not.toBeChecked();
    expect(onCheckedChange.mock.calls).toEqual([[true], [false]]);
  });

  it("toggles when the label is clicked", async () => {
    const user = userEvent.setup();
    render(<Switch label="Bluetooth" defaultChecked />);
    await user.click(screen.getByText("Bluetooth"));
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("can be controlled", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [on, setOn] = useState(true);
      return (
        <>
          <Switch label="Sync" checked={on} onCheckedChange={setOn} />
          <output>{on ? "on" : "off"}</output>
        </>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole("switch"));
    expect(screen.getByText("off")).toBeInTheDocument();
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    render(<Switch label="Locked" disabled />);
    await user.click(screen.getByRole("switch"));
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("submits its value in forms when on", () => {
    const { container } = render(
      <form>
        <Switch label="Alerts" name="alerts" defaultChecked />
      </form>,
    );
    const data = new FormData(container.querySelector("form")!);
    expect(data.get("alerts")).toBe("on");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <Switch label="On" defaultChecked />
        <Switch label="Off" description="Help text" />
      </div>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});
