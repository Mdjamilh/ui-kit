import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { cx } from "../../utils/cx";

export type ToastTone = "info" | "success" | "error";

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** Milliseconds before the toast closes itself. Use Infinity to keep it until dismissed. */
  duration?: number;
}

interface ToastRecord extends Required<Pick<ToastOptions, "tone" | "duration">> {
  id: number;
  title: ReactNode;
  description?: ReactNode;
}

interface ToastApi {
  /** Shows a toast and returns its id. */
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = /* @__PURE__ */ createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

export interface ToastProviderProps {
  children: ReactNode;
  /** Default auto-dismiss time in ms. Defaults to 5000. */
  duration?: number;
  /** Accessible name of the notifications region. */
  label?: string;
  /** Label of each toast's dismiss button. */
  dismissLabel?: string;
}

let nextId = 1;

/**
 * Holds toasts and renders them in live regions that exist before any
 * toast is added, so screen readers reliably announce new messages. Errors
 * go to an assertive region; everything else is polite. Timers
 * pause while the pointer is over the region or focus is inside it, so
 * people have time to read or reach the dismiss button.
 */
export function ToastProvider({
  children,
  duration = 5000,
  label = "Notifications",
  dismissLabel = "Dismiss notification",
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ tone = "info", duration: d = duration, ...rest }: ToastOptions) => {
      const id = nextId++;
      setToasts((list) => [...list, { id, tone, duration: d, ...rest }]);
      return id;
    },
    [duration],
  );

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);
  const paused = hovered || focused;

  const region = (
    <section
      className="uk-toast-region"
      aria-label={label}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      {(["polite", "assertive"] as const).map((politeness) => (
        <ol
          key={politeness}
          className="uk-toast-list"
          aria-live={politeness}
          aria-relevant="additions text"
          aria-atomic="false"
        >
          {toasts
            .filter((t) => (t.tone === "error") === (politeness === "assertive"))
            .map((t) => (
              <ToastItem
                key={t.id}
                toast={t}
                paused={paused}
                dismissLabel={dismissLabel}
                onDismiss={() => dismiss(t.id)}
              />
            ))}
        </ol>
      ))}
    </section>
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {mounted && createPortal(region, document.body)}
    </ToastContext.Provider>
  );
}

interface ToastItemProps {
  toast: ToastRecord;
  paused: boolean;
  dismissLabel: string;
  onDismiss: () => void;
}

function ToastItem({ toast, paused, dismissLabel, onDismiss }: ToastItemProps) {
  const remaining = useRef(toast.duration);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (paused || !Number.isFinite(remaining.current)) return;
    const started = Date.now();
    const timer = setTimeout(() => onDismissRef.current(), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (Date.now() - started));
    };
  }, [paused]);

  return (
    <li className={cx("uk-toast", `uk-toast--${toast.tone}`)}>
      <div className="uk-toast__content">
        <p className="uk-toast__title">{toast.title}</p>
        {toast.description && <p className="uk-toast__description">{toast.description}</p>}
      </div>
      <button type="button" className="uk-toast__dismiss" aria-label={dismissLabel} onClick={onDismiss}>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </li>
  );
}
