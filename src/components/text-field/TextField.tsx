import { useId } from "react";
import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "../../utils/cx";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Visible label. Required: placeholders are not labels. */
  label: ReactNode;
  /** Helper text shown under the input and linked with aria-describedby. */
  hint?: ReactNode;
  /** Error message. When set, the input is marked aria-invalid and the message is announced with the hint. */
  error?: ReactNode;
  /** Class for the outer wrapper. */
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

export function TextField({
  label,
  hint,
  error,
  id,
  className,
  required,
  type = "text",
  "aria-describedby": describedByProp,
  ref,
  ...rest
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? `uk-text-field-${generatedId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [describedByProp, hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cx("uk-field", error ? "uk-field--invalid" : undefined, className)}>
      <label className="uk-field__label" htmlFor={inputId}>
        {label}
        {required && (
          <span className="uk-field__required" aria-hidden="true">
            {" *"}
          </span>
        )}
      </label>
      <input
        {...rest}
        ref={ref}
        id={inputId}
        type={type}
        required={required}
        className="uk-field__input"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />
      {hint && (
        <p id={hintId} className="uk-field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="uk-field__error">
          {error}
        </p>
      )}
    </div>
  );
}
