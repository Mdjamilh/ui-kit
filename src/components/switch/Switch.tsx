import { useId } from "react";
import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";

export interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "value" | "defaultValue"> {
  label: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Secondary text linked with aria-describedby. */
  description?: ReactNode;
  /** When set, a hidden input with this name carries "on" in form submissions while checked. */
  name?: string;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * An on/off control using the WAI-ARIA switch pattern: a button with
 * role="switch" and aria-checked. Enter and Space toggle it because it is a
 * native button.
 */
export function Switch({
  label,
  checked,
  defaultChecked = false,
  onCheckedChange,
  description,
  name,
  id,
  className,
  onClick,
  ref,
  ...rest
}: SwitchProps) {
  const generatedId = useId();
  const switchId = id ?? `uk-switch-${generatedId}`;
  const labelId = `${switchId}-label`;
  const descriptionId = description ? `${switchId}-description` : undefined;
  const [on, setOn] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  return (
    <div className={cx("uk-switch", className)}>
      <button
        {...rest}
        ref={ref}
        id={switchId}
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        className="uk-switch__control"
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) setOn(!on);
        }}
      >
        <span className="uk-switch__thumb" aria-hidden="true" />
      </button>
      <div className="uk-switch__text">
        <label id={labelId} htmlFor={switchId} className="uk-switch__label">
          {label}
        </label>
        {description && (
          <p id={descriptionId} className="uk-switch__description">
            {description}
          </p>
        )}
      </div>
      {name && on && <input type="hidden" name={name} value="on" />}
    </div>
  );
}
