import type { ButtonHTMLAttributes, MouseEvent, Ref } from "react";
import { cx } from "../../utils/cx";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * Shows a spinner and blocks clicks. The button stays focusable (it uses
   * aria-disabled instead of disabled) so keyboard focus is not lost mid-action.
   */
  loading?: boolean;
  /** Text announced while loading. Defaults to "Loading". */
  loadingLabel?: string;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  loadingLabel = "Loading",
  type = "button",
  className,
  children,
  onClick,
  disabled,
  ref,
  ...rest
}: ButtonProps) {
  const blocked = loading || disabled;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      disabled={disabled && !loading}
      aria-disabled={blocked || undefined}
      aria-busy={loading || undefined}
      className={cx(
        "uk-button",
        `uk-button--${variant}`,
        `uk-button--${size}`,
        loading && "uk-button--loading",
        className,
      )}
      onClick={handleClick}
    >
      {loading && <span className="uk-spinner" aria-hidden="true" />}
      <span className="uk-button__label">{children}</span>
      {loading && <span className="uk-visually-hidden">{`, ${loadingLabel}`}</span>}
    </button>
  );
}
