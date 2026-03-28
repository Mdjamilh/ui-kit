import { createContext, useContext, useId, useRef } from "react";
import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/useControllableState";

type Activation = "automatic" | "manual";
type Orientation = "horizontal" | "vertical";

interface TabsContextValue {
  baseId: string;
  value: string;
  setValue: (value: string) => void;
  activation: Activation;
  orientation: Orientation;
}

const TabsContext = /* @__PURE__ */ createContext<TabsContextValue | null>(null);

function useTabs(component: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <Tabs>`);
  return ctx;
}

/** Turns an arbitrary value into something safe to use in an id attribute. */
function idPart(value: string): string {
  return value.replace(/[^\w-]/g, "_");
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  value?: string;
  defaultValue: string;
  onValueChange?: (value: string) => void;
  /**
   * "automatic" (default) selects a tab as soon as it receives focus.
   * "manual" moves focus with the arrows and selects on Enter or Space,
   * which is better when showing a panel is slow.
   */
  activation?: Activation;
  orientation?: Orientation;
  children: ReactNode;
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  activation = "automatic",
  orientation = "horizontal",
  className,
  children,
  ...rest
}: TabsProps) {
  const baseId = `uk-tabs-${useId()}`;
  const [current, setValue] = useControllableState({ value, defaultValue, onChange: onValueChange });

  return (
    <TabsContext.Provider value={{ baseId, value: current, setValue, activation, orientation }}>
      <div {...rest} className={cx("uk-tabs", `uk-tabs--${orientation}`, className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  /** Name for the tab list. Provide this or aria-labelledby. */
  "aria-label"?: string;
  children: ReactNode;
}

export function TabList({ className, children, onKeyDown, ...rest }: TabListProps) {
  const { orientation, activation, setValue } = useTabs("TabList");
  const listRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || !listRef.current) return;

    const tabs = Array.from(
      listRef.current.querySelectorAll<HTMLElement>('[role="tab"]:not([aria-disabled="true"])'),
    );
    const index = tabs.indexOf(document.activeElement as HTMLElement);
    if (index === -1) return;

    const prevKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
    const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    let target: number | null = null;

    switch (event.key) {
      case prevKey:
        target = (index - 1 + tabs.length) % tabs.length;
        break;
      case nextKey:
        target = (index + 1) % tabs.length;
        break;
      case "Home":
        target = 0;
        break;
      case "End":
        target = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const tab = tabs[target]!;
    tab.focus();
    if (activation === "automatic") setValue(tab.dataset.value!);
  }

  return (
    <div
      {...rest}
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      className={cx("uk-tabs__list", className)}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}

export interface TabProps extends Omit<HTMLAttributes<HTMLButtonElement>, "id"> {
  value: string;
  disabled?: boolean;
  children: ReactNode;
}

export function Tab({ value, disabled = false, className, children, onClick, ...rest }: TabProps) {
  const { baseId, value: selectedValue, setValue } = useTabs("Tab");
  const selected = value === selectedValue;

  return (
    <button
      {...rest}
      type="button"
      role="tab"
      id={`${baseId}-tab-${idPart(value)}`}
      data-value={value}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${idPart(value)}`}
      aria-disabled={disabled || undefined}
      tabIndex={selected ? 0 : -1}
      className={cx("uk-tabs__tab", className)}
      onClick={(event) => {
        onClick?.(event);
        if (!disabled && !event.defaultPrevented) setValue(value);
      }}
    >
      {children}
    </button>
  );
}

export interface TabPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "id"> {
  value: string;
  children: ReactNode;
}

export function TabPanel({ value, className, children, ...rest }: TabPanelProps) {
  const { baseId, value: selectedValue } = useTabs("TabPanel");
  const selected = value === selectedValue;

  return (
    <div
      {...rest}
      role="tabpanel"
      id={`${baseId}-panel-${idPart(value)}`}
      aria-labelledby={`${baseId}-tab-${idPart(value)}`}
      tabIndex={0}
      hidden={!selected}
      className={cx("uk-tabs__panel", className)}
    >
      {selected && children}
    </div>
  );
}
