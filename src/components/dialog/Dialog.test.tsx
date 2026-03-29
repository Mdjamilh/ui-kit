import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Dialog } from "./Dialog";
import type { DialogProps } from "./Dialog";

function Harness(props: Partial<DialogProps> & { withInitialFocus?: boolean }) {
  const [open, setOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const { withInitialFocus, ...rest } = props;
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Edit profile"
        description="Changes are saved when you press Save."
        initialFocus={withInitialFocus ? nameRef : undefined}
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="button">Save</button>
          </>
        }
        {...rest}
      >
        <label>
          Name <input ref={nameRef} />
        </label>
      </Dialog>
    </>
  );
}

async function openDialog(props: Partial<DialogProps> & { withInitialFocus?: boolean } = {}) {
  const user = userEvent.setup();
  render(<Harness {...props} />);
  await user.click(screen.getByRole("button", { name: "Open" }));
  return user;
}

describe("Dialog", () => {
  it("renders nothing while closed", () => {
    render(<Harness />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("is a labelled, described modal dialog", async () => {
    await openDialog();
    const dialog = screen.getByRole("dialog", { name: "Edit profile" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleDescription("Changes are saved when you press Save.");
  });

  it("moves focus to the first focusable element on open", async () => {
    await openDialog();
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
  });

  it("honours initialFocus", async () => {
    await openDialog({ withInitialFocus: true });
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveFocus();
  });

  it("traps Tab and Shift+Tab inside the dialog", async () => {
    const user = await openDialog();
    const close = screen.getByRole("button", { name: "Close" });
    const save = screen.getByRole("button", { name: "Save" });
    await user.tab();
    expect(screen.getByRole("textbox")).toHaveFocus();
    await user.tab();
    await user.tab();
    expect(save).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(save).toHaveFocus();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = await openDialog();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open" })).toHaveFocus();
  });

  it("closes from the close button and from a footer button", async () => {
    const user = await openDialog();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on a backdrop click unless disabled", async () => {
    const user = await openDialog();
    await user.click(document.querySelector(".uk-dialog__backdrop")!);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps the dialog open on a backdrop click when closeOnBackdropClick is false", async () => {
    const user = await openDialog({ closeOnBackdropClick: false });
    await user.click(document.querySelector(".uk-dialog__backdrop")!);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("does not close when clicking inside the panel", async () => {
    const user = await openDialog();
    await user.click(screen.getByRole("textbox"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("locks body scroll while open and restores it after", async () => {
    document.body.style.overflow = "auto";
    const user = await openDialog();
    expect(document.body.style.overflow).toBe("hidden");
    await user.keyboard("{Escape}");
    expect(document.body.style.overflow).toBe("auto");
    document.body.style.overflow = "";
  });

  it("closes nested dialogs one at a time", async () => {
    const user = userEvent.setup();
    const onOuterClose = vi.fn();
    function Nested() {
      const [inner, setInner] = useState(false);
      return (
        <Dialog open onClose={onOuterClose} title="Outer">
          <button type="button" onClick={() => setInner(true)}>
            Open inner
          </button>
          <Dialog open={inner} onClose={() => setInner(false)} title="Inner">
            <button type="button">Inner action</button>
          </Dialog>
        </Dialog>
      );
    }
    render(<Nested />);
    await user.click(screen.getByRole("button", { name: "Open inner" }));
    expect(screen.getByRole("dialog", { name: "Inner" })).toBeInTheDocument();
    await user.tab();
    await user.tab();
    expect(screen.getByRole("dialog", { name: "Inner" })).toContainElement(
      document.activeElement as HTMLElement,
    );
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Inner" })).not.toBeInTheDocument();
    expect(onOuterClose).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Open inner" })).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("has no axe violations while open", async () => {
    await openDialog();
    await expect(document.body).toHaveNoAxeViolations();
  });
});
