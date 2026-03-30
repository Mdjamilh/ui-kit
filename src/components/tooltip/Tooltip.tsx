import { cloneElement, isValidElement, useEffect, useId, useRef, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { cx } from "../../utils/cx";

const HIDE_GRACE_MS = 100;

export interface TooltipProps {
  /** Short text describing the trigger. Do not put interactive content in a tooltip. */
  content: ReactNode;
  /** A single focusable element, usually a button. */
  children: ReactElement<{ "aria-describedby"?: string }>;
  placement?: "top" | "bottom";
  /** Delay before showing on hover, in ms. Keyboard focus shows it immediately. */
  delay?: number;
  className?: string;
}

/**
 * Tooltip following the WAI-ARIA tooltip pattern. It shows on hover and on
 * keyboard focus, hides on Escape, and stays open while the pointer is over
 * it (WCAG 1.4.13). The text is always in the DOM and linked with
 * aria-describedby, so screen readers get it without needing to hover.
 */
export function Tooltip({ content, children, placement = "top", delay = 300, className }: TooltipProps) {
  const tooltipId = `uk-tooltip-${useId()}`;
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function clearTimer() {
    if (timer.current !== undefined) clearTimeout(timer.current);
    timer.current = undefined;
  }

  function show(immediate: boolean) {
    clearTimer();
    if (open || immediate || delay <= 0) setOpen(true);
    else timer.current = setTimeout(() => setOpen(true), delay);
  }

  function hide() {
    clearTimer();
    setOpen(false);
  }

  /** Pointer leave waits briefly so the pointer can cross the gap onto the bubble. */
  function hideSoon() {
    clearTimer();
    timer.current = setTimeout(() => setOpen(false), HIDE_GRACE_MS);
  }

  useEffect(() => clearTimer, []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!isValidElement(children)) {
    throw new Error("<Tooltip> expects a single element child");
  }

  const describedBy = [children.props["aria-describedby"], tooltipId].filter(Boolean).join(" ");

  return (
    <span
      className={cx("uk-tooltip", className)}
      onPointerEnter={() => show(false)}
      onPointerLeave={hideSoon}
      onFocus={() => show(true)}
      onBlur={hide}
    >
      {cloneElement(children, { "aria-describedby": describedBy })}
      <span
        id={tooltipId}
        role="tooltip"
        className={cx("uk-tooltip__bubble", `uk-tooltip__bubble--${placement}`)}
        data-open={open || undefined}
      >
        {content}
      </span>
    </span>
  );
}
