import { useEffect } from "react";
import type { RefObject } from "react";
import { getTabbable } from "./focus";

/** Active traps, newest last. Only the newest one reacts, so nested dialogs work. */
const trapStack: HTMLElement[] = [];

export interface FocusTrapOptions {
  /** Element to focus first. Defaults to the first tabbable element, then the container. */
  initialFocus?: RefObject<HTMLElement | null>;
  /** Return focus to whatever was focused before the trap started. Defaults to true. */
  restoreFocus?: boolean;
}

/**
 * Keeps Tab and Shift+Tab inside `containerRef` while `active`, moves focus
 * in when it starts and gives focus back when it ends.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  { initialFocus, restoreFocus = true }: FocusTrapOptions = {},
): void {
  useEffect(() => {
    const container = containerRef.current;
    if (!active || !container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    trapStack.push(container);
    const isTop = () => trapStack[trapStack.length - 1] === container;
    const target = initialFocus?.current ?? getTabbable(container)[0] ?? container;
    target.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || !container || !isTop()) return;
      const tabbable = getTabbable(container);
      if (tabbable.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }
      const first = tabbable[0]!;
      const last = tabbable[tabbable.length - 1]!;
      const current = document.activeElement;
      if (event.shiftKey && (current === first || !container.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !container.contains(current))) {
        event.preventDefault();
        first.focus();
      }
    }

    // If focus escapes (for example a click on the backdrop), pull it back.
    function onFocusIn(event: FocusEvent) {
      if (container && isTop() && !container.contains(event.target as Node)) {
        (getTabbable(container)[0] ?? container).focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
      trapStack.splice(trapStack.indexOf(container), 1);
      if (restoreFocus && previouslyFocused && previouslyFocused.isConnected) {
        previouslyFocused.focus();
      }
    };
    // initialFocus is a ref; reading .current inside the effect is intentional.
  }, [active, containerRef, initialFocus, restoreFocus]);
}
