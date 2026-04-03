import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode, Ref } from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label: ReactNode;
  options: SelectOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  /** Text shown when nothing is selected. */
  placeholder?: string;
  /** Helper text linked with aria-describedby. */
  hint?: ReactNode;
  disabled?: boolean;
  /** When set, a hidden input carries the value in form submissions. */
  name?: string;
  id?: string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

const TYPEAHEAD_RESET_MS = 500;

/**
 * Select-only combobox from the WAI-ARIA Authoring Practices. Focus stays on
 * the combobox; the highlighted option is exposed with aria-activedescendant.
 *
 * Closed: Down, Up, Enter, Space, Home and End open the list; typing jumps to
 * a matching option. Open: Up and Down move, Home and End jump, Enter, Space
 * or Tab choose, Escape closes without choosing.
 */
export function Select({
  label,
  options,
  value,
  defaultValue = null,
  onValueChange,
  placeholder = "Select an option",
  hint,
  disabled = false,
  name,
  id,
  className,
  ref,
}: SelectProps) {
  const generatedId = useId();
  const baseId = id ?? `uk-select-${generatedId}`;
  const labelId = `${baseId}-label`;
  const listboxId = `${baseId}-listbox`;
  const hintId = hint ? `${baseId}-hint` : undefined;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  const [selected, setSelected] = useControllableState<string | null>({
    value,
    defaultValue,
    onChange: onValueChange as ((v: string | null) => void) | undefined,
  });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: "", time: 0 });

  const selectedIndex = options.findIndex((o) => o.value === selected);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const enabledIndexes = options.flatMap((o, i) => (o.disabled ? [] : [i]));
  const firstEnabled = enabledIndexes[0] ?? -1;
  const lastEnabled = enabledIndexes[enabledIndexes.length - 1] ?? -1;

  function step(from: number, direction: 1 | -1): number {
    for (let i = from + direction; i >= 0 && i < options.length; i += direction) {
      if (!options[i]!.disabled) return i;
    }
    return from;
  }

  function openWith(index: number) {
    setOpen(true);
    setActive(index);
  }

  function close() {
    setOpen(false);
    setActive(-1);
  }

  function choose(index: number) {
    const option = options[index];
    if (option && !option.disabled) setSelected(option.value);
    close();
  }

  function matchTypeahead(key: string): number {
    const now = Date.now();
    const state = typeahead.current;
    state.text = now - state.time > TYPEAHEAD_RESET_MS ? key : state.text + key;
    state.time = now;
    const query = state.text.toLowerCase();
    const start = open ? active : selectedIndex;
    // Repeating one letter cycles through options with that initial.
    const cycling = query.length > 1 && query.split("").every((c) => c === query[0]);
    const search = cycling ? query[0]! : query;
    const order = [...options.keys()].map((i) => (start + 1 + i) % options.length);
    if (!cycling && query.length > 1) order.unshift(Math.max(start, 0));
    return (
      order.find((i) => !options[i]!.disabled && options[i]!.label.toLowerCase().startsWith(search)) ?? -1
    );
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;
    const { key, altKey } = event;
    const current = selectedIndex >= 0 ? selectedIndex : firstEnabled;

    if (!open) {
      switch (key) {
        case "ArrowDown":
        case "ArrowUp":
        case "Enter":
        case " ":
          event.preventDefault();
          openWith(current);
          return;
        case "Home":
          event.preventDefault();
          openWith(firstEnabled);
          return;
        case "End":
          event.preventDefault();
          openWith(lastEnabled);
          return;
      }
    } else {
      switch (key) {
        case "ArrowDown":
          event.preventDefault();
          setActive(step(active, 1));
          return;
        case "ArrowUp":
          event.preventDefault();
          if (altKey) choose(active);
          else setActive(step(active, -1));
          return;
        case "Home":
          event.preventDefault();
          setActive(firstEnabled);
          return;
        case "End":
          event.preventDefault();
          setActive(lastEnabled);
          return;
        case "PageDown":
          event.preventDefault();
          setActive(enabledIndexes.find((i) => i >= active + 10) ?? lastEnabled);
          return;
        case "PageUp":
          event.preventDefault();
          setActive([...enabledIndexes].reverse().find((i) => i <= active - 10) ?? firstEnabled);
          return;
        case "Enter":
        case " ":
          event.preventDefault();
          choose(active);
          return;
        case "Tab":
          // Do not prevent default: focus moves on as usual, with the highlighted option chosen.
          choose(active);
          return;
        case "Escape":
          event.preventDefault();
          close();
          return;
      }
    }

    if (key.length === 1 && !event.ctrlKey && !event.metaKey && !altKey) {
      const match = matchTypeahead(key);
      if (match >= 0) {
        if (open) setActive(match);
        else openWith(match);
      }
    }
  }

  // Keep the highlighted option visible inside a scrolling list.
  useEffect(() => {
    if (!open || active < 0) return;
    const el = document.getElementById(optionId(active));
    el?.scrollIntoView?.({ block: "nearest" });
    // optionId only depends on baseId, which is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active]);

  return (
    <div className={cx("uk-select", open && "uk-select--open", className)}>
      <div id={labelId} className="uk-select__label">
        {label}
      </div>
      <div
        ref={ref}
        id={baseId}
        role="combobox"
        tabIndex={disabled ? -1 : 0}
        aria-labelledby={labelId}
        aria-describedby={hintId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        aria-disabled={disabled || undefined}
        className="uk-select__trigger"
        onClick={() => {
          if (disabled) return;
          if (open) close();
          else openWith(selectedIndex >= 0 ? selectedIndex : firstEnabled);
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (open) close();
        }}
      >
        <span className={cx("uk-select__value", !selectedOption && "uk-select__value--placeholder")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg className="uk-select__chevron" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <ul
        ref={listRef}
        id={listboxId}
        role="listbox"
        aria-labelledby={labelId}
        tabIndex={-1}
        hidden={!open}
        className="uk-select__listbox"
      >
        {options.map((option, index) => (
          <li
            key={option.value}
            id={optionId(index)}
            role="option"
            aria-selected={option.value === selected}
            aria-disabled={option.disabled || undefined}
            data-active={index === active || undefined}
            className="uk-select__option"
            // Keep focus on the combobox when an option is pressed.
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => !option.disabled && choose(index)}
            onPointerMove={() => !option.disabled && setActive(index)}
          >
            {option.label}
          </li>
        ))}
      </ul>
      {hint && (
        <p id={hintId} className="uk-select__hint">
          {hint}
        </p>
      )}
      {name && <input type="hidden" name={name} value={selected ?? ""} />}
    </div>
  );
}
