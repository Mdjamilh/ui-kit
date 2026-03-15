import { useCallback, useRef, useState } from "react";

export interface ControllableStateOptions<T> {
  /** Controlled value. When defined, the component does not keep its own state. */
  value?: T;
  /** Initial value for uncontrolled usage. */
  defaultValue: T;
  /** Called with the next value whenever it changes, controlled or not. */
  onChange?: (value: T) => void;
}

/**
 * State that can be either controlled by a parent (value + onChange) or
 * owned by the component (defaultValue). Mirrors how native inputs behave.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: ControllableStateOptions<T>): [T, (next: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const currentRef = useRef(current);
  currentRef.current = current;

  const setValue = useCallback(
    (next: T) => {
      if (Object.is(next, currentRef.current)) return;
      if (!isControlled) setInternal(next);
      onChangeRef.current?.(next);
    },
    [isControlled],
  );

  return [current, setValue];
}
