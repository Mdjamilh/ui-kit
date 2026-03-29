import { useEffect, useId, useRef } from "react";
import type { HTMLAttributes, MouseEvent, ReactNode, RefObject } from "react";
import { createPortal } from "react-dom";
import { cx } from "../../utils/cx";
import { useFocusTrap } from "../../utils/useFocusTrap";
import { useScrollLock } from "../../utils/useScrollLock";

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  open: boolean;
  /** Called when the user asks to close: Escape, the close button or a backdrop click. */
  onClose: () => void;
  /** Heading for the dialog, used as its accessible name. */
  title: ReactNode;
  /** Optional text under the title, used as the accessible description. */
  description?: ReactNode;
  /** Element to focus when the dialog opens. Defaults to the first focusable element. */
  initialFocus?: RefObject<HTMLElement | null>;
  /** Close when the dimmed backdrop is clicked. Defaults to true. */
  closeOnBackdropClick?: boolean;
  /** Accessible label for the X button. Defaults to "Close". */
  closeLabel?: string;
  /** Buttons rendered at the bottom of the dialog. */
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
}

/**
 * Modal dialog following the WAI-ARIA dialog pattern: focus moves in on open,
 * Tab is trapped inside, Escape closes, focus returns to the trigger, and the
 * page behind does not scroll.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  initialFocus,
  closeOnBackdropClick = true,
  closeLabel = "Close",
  footer,
  size = "md",
  className,
  children,
  ...rest
}: DialogProps) {
  const id = useId();
  const titleId = `uk-dialog-${id}-title`;
  const descriptionId = description ? `uk-dialog-${id}-description` : undefined;
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useFocusTrap(panelRef, open, { initialFocus });
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      // Only the dialog that contains focus closes, so nested dialogs close one at a time.
      if (panel && panel.contains(document.activeElement)) {
        event.preventDefault();
        onCloseRef.current();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!open) return null;

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (closeOnBackdropClick && event.target === event.currentTarget) onClose();
  }

  return createPortal(
    <div className="uk-dialog__backdrop" onClick={handleBackdropClick}>
      <div
        {...rest}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className={cx("uk-dialog", `uk-dialog--${size}`, className)}
      >
        <div className="uk-dialog__header">
          <h2 id={titleId} className="uk-dialog__title">
            {title}
          </h2>
          <button type="button" className="uk-dialog__close" aria-label={closeLabel} onClick={onClose}>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {description && (
          <p id={descriptionId} className="uk-dialog__description">
            {description}
          </p>
        )}
        {children && <div className="uk-dialog__body">{children}</div>}
        {footer && <div className="uk-dialog__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
