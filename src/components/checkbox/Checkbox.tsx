import { useEffect, useId, useRef } from "react";
import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "../../utils/cx";
import { mergeRefs } from "../../utils/refs";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  /** Secondary text linked with aria-describedby. */
  description?: ReactNode;
  /** Shows the mixed state (for "select all" rows). The native property is set, so assistive tech reports "mixed". */
  indeterminate?: boolean;
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

/**
 * A styled native checkbox. Using the real input keeps Space toggling,
 * form submission and label clicks working without extra code.
 */
export function Checkbox({
  label,
  description,
  indeterminate = false,
  id,
  className,
  ref,
  ...rest
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? `uk-checkbox-${generatedId}`;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const innerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div className={cx("uk-checkbox", className)}>
      <input
        {...rest}
        ref={mergeRefs(innerRef, ref)}
        id={inputId}
        type="checkbox"
        className="uk-checkbox__input"
        aria-describedby={descriptionId}
      />
      <div className="uk-checkbox__text">
        <label htmlFor={inputId} className="uk-checkbox__label">
          {label}
        </label>
        {description && (
          <p id={descriptionId} className="uk-checkbox__description">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
