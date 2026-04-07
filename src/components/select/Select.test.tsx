import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";
import type { SelectProps } from "./Select";

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "apricot", label: "Apricot" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry", disabled: true },
  { value: "cherry", label: "Cherry" },
];

function renderSelect(props: Partial<SelectProps> = {}) {
  const user = userEvent.setup();
  const onValueChange = vi.fn();
  render(
    <>
      <Select label="Fruit" options={fruits} onValueChange={onValueChange} {...props} />
      <button type="button">After</button>
    </>,
  );
  const combobox = screen.getByRole("combobox", { name: "Fruit" });
  return { user, onValueChange, combobox };
}

const listbox = () => screen.getByRole("listbox", { hidden: true });
const activeOption = (combobox: HTMLElement) => {
  const id = combobox.getAttribute("aria-activedescendant");
  return id ? document.getElementById(id) : null;
};

describe("Select", () => {
  it("exposes the select-only combobox pattern", () => {
    const { combobox } = renderSelect({ hint: "Pick one" });
    expect(combobox).toHaveAttribute("aria-haspopup", "listbox");
    expect(combobox).toHaveAttribute("aria-expanded", "false");
    expect(combobox).toHaveAttribute("aria-controls", listbox().id);
    expect(combobox).toHaveAccessibleDescription("Pick one");
    expect(combobox).toHaveTextContent("Select an option");
    expect(listbox()).not.toBeVisible();
  });

  it("opens with ArrowDown and highlights the first option", async () => {
    const { user, combobox } = renderSelect();
    await user.tab();
    await user.keyboard("{ArrowDown}");
    expect(combobox).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox", { name: "Fruit" })).toBeVisible();
    expect(activeOption(combobox)).toHaveTextContent("Apple");
    expect(combobox).toHaveFocus();
  });

  it("moves with arrows, skips disabled options and selects with Enter", async () => {
    const { user, combobox, onValueChange } = renderSelect();
    await user.tab();
    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}");
    expect(activeOption(combobox)).toHaveTextContent("Cherry");
    await user.keyboard("{ArrowDown}");
    expect(activeOption(combobox)).toHaveTextContent("Cherry");
    await user.keyboard("{ArrowUp}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("banana");
    expect(combobox).toHaveAttribute("aria-expanded", "false");
    expect(combobox).not.toHaveAttribute("aria-activedescendant");
    expect(combobox).toHaveTextContent("Banana");
    expect(screen.getByRole("option", { name: "Banana", hidden: true })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("supports Home and End, opening on the matching edge", async () => {
    const { user, combobox } = renderSelect();
    await user.tab();
    await user.keyboard("{End}");
    expect(activeOption(combobox)).toHaveTextContent("Cherry");
    await user.keyboard("{Home}");
    expect(activeOption(combobox)).toHaveTextContent("Apple");
  });

  it("closes on Escape without changing the value", async () => {
    const { user, combobox, onValueChange } = renderSelect({ defaultValue: "cherry" });
    await user.tab();
    await user.keyboard("{ArrowUp}");
    expect(activeOption(combobox)).toHaveTextContent("Cherry");
    await user.keyboard("{ArrowUp}{Escape}");
    expect(combobox).toHaveAttribute("aria-expanded", "false");
    expect(combobox).toHaveTextContent("Cherry");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("chooses the highlighted option on Tab and lets focus move on", async () => {
    const { user, combobox, onValueChange } = renderSelect();
    await user.tab();
    await user.keyboard("{ArrowDown}{ArrowDown}");
    await user.tab();
    expect(onValueChange).toHaveBeenCalledWith("apricot");
    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    expect(combobox).toHaveAttribute("aria-expanded", "false");
  });

  it("jumps with typeahead and cycles on repeated letters", async () => {
    const { user, combobox } = renderSelect();
    await user.tab();
    await user.keyboard("b");
    expect(combobox).toHaveAttribute("aria-expanded", "true");
    expect(activeOption(combobox)).toHaveTextContent("Banana");
    await user.keyboard("{Escape}");
    await user.keyboard("a");
    expect(activeOption(combobox)).toHaveTextContent("Apple");
    await user.keyboard("a");
    expect(activeOption(combobox)).toHaveTextContent("Apricot");
  });

  it("matches multi-letter typeahead", async () => {
    const { user, combobox } = renderSelect();
    await user.tab();
    await user.keyboard("apr");
    expect(activeOption(combobox)).toHaveTextContent("Apricot");
  });

  it("selects by mouse and keeps focus on the combobox", async () => {
    const { user, combobox, onValueChange } = renderSelect();
    await user.click(combobox);
    await user.click(screen.getByRole("option", { name: "Cherry" }));
    expect(onValueChange).toHaveBeenCalledWith("cherry");
    expect(combobox).toHaveFocus();
    await user.click(combobox);
    await user.click(screen.getByRole("option", { name: "Blueberry" }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("closes when focus leaves", async () => {
    const { user, combobox } = renderSelect();
    await user.click(combobox);
    await user.click(screen.getByRole("button", { name: "After" }));
    expect(combobox).toHaveAttribute("aria-expanded", "false");
  });

  it("is skipped by Tab and inert when disabled", async () => {
    const { user, combobox } = renderSelect({ disabled: true });
    expect(combobox).toHaveAttribute("aria-disabled", "true");
    await user.tab();
    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    await user.click(combobox);
    expect(combobox).toHaveAttribute("aria-expanded", "false");
  });

  it("submits its value through a hidden input", () => {
    const { container } = render(
      <form>
        <Select label="Fruit" name="fruit" options={fruits} defaultValue="banana" />
      </form>,
    );
    expect(new FormData(container.querySelector("form")!).get("fruit")).toBe("banana");
  });

  it("has no axe violations closed and open", async () => {
    const { user, combobox } = renderSelect({ hint: "Pick one" });
    await expect(document.body).toHaveNoAxeViolations();
    await user.click(combobox);
    await expect(document.body).toHaveNoAxeViolations();
  });
});
