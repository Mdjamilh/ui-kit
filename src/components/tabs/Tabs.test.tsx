import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tab, TabList, TabPanel, Tabs } from "./Tabs";
import type { TabsProps } from "./Tabs";

function Example(props: Partial<TabsProps>) {
  return (
    <Tabs defaultValue="one" {...props}>
      <TabList aria-label="Settings">
        <Tab value="one">One</Tab>
        <Tab value="two">Two</Tab>
        <Tab value="three" disabled>
          Three
        </Tab>
        <Tab value="four">Four</Tab>
      </TabList>
      <TabPanel value="one">Panel one</TabPanel>
      <TabPanel value="two">Panel two</TabPanel>
      <TabPanel value="three">Panel three</TabPanel>
      <TabPanel value="four">Panel four</TabPanel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("wires tabs and panels together with ARIA", () => {
    render(<Example />);
    expect(screen.getByRole("tablist", { name: "Settings" })).toHaveAttribute(
      "aria-orientation",
      "horizontal",
    );
    const tab = screen.getByRole("tab", { name: "One" });
    const panel = screen.getByRole("tabpanel", { name: "One" });
    expect(tab).toHaveAttribute("aria-selected", "true");
    expect(tab).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", tab.id);
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "false");
    expect(screen.queryByText("Panel two")).not.toBeInTheDocument();
  });

  it("uses a roving tabindex so only the selected tab is in the tab order", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((t) => t.tabIndex)).toEqual([0, -1, -1, -1]);
    await user.tab();
    expect(tabs[0]).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("tabpanel")).toHaveFocus();
  });

  it("moves and selects with arrow keys, wrapping and skipping disabled tabs", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel two");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Four" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Four" })).toHaveFocus();
    expect(onValueChange.mock.calls).toEqual([["two"], ["four"], ["one"], ["four"]]);
  });

  it("supports Home and End", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Four" })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");
  });

  it("only moves focus in manual mode until Enter or Space", async () => {
    const user = userEvent.setup();
    render(<Example activation="manual" />);
    await user.tab();
    await user.keyboard("{ArrowRight}");
    const two = screen.getByRole("tab", { name: "Two" });
    expect(two).toHaveFocus();
    expect(two).toHaveAttribute("aria-selected", "false");
    await user.keyboard("{Enter}");
    expect(two).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowRight}{ }");
    expect(screen.getByRole("tab", { name: "Four" })).toHaveAttribute("aria-selected", "true");
  });

  it("uses up and down arrows when vertical", async () => {
    const user = userEvent.setup();
    render(<Example orientation="vertical" />);
    expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical");
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
  });

  it("ignores clicks on disabled tabs", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("tab", { name: "Three" }));
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");
  });

  it("can be controlled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example value="two" onValueChange={onValueChange} />);
    await user.click(screen.getByRole("tab", { name: "Four" }));
    expect(onValueChange).toHaveBeenCalledWith("four");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
  });

  it("throws a helpful error outside <Tabs>", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Tab value="x">X</Tab>)).toThrow("<Tab> must be used inside <Tabs>");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Example />);
    await expect(container).toHaveNoAxeViolations();
  });
});
