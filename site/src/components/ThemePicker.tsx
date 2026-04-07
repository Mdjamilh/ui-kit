import { Select } from "@mdjamilh/ui-kit";
import { useState } from "react";

type Theme = "system" | "light" | "dark";
const STORAGE_KEY = "uk-docs-theme";

function readTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : "system";
  } catch {
    return "system";
  }
}

/** Switches the data-theme attribute that the design tokens key off. */
export function ThemePicker() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  function apply(next: string) {
    const value = next as Theme;
    setTheme(value);
    if (value === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = value;
    try {
      if (value === "system") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Storage can be unavailable in private windows; the theme still applies for this visit.
    }
  }

  return (
    <div className="docs-theme">
      <Select
        label="Theme"
        value={theme}
        onValueChange={apply}
        options={[
          { value: "system", label: "System" },
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ]}
      />
    </div>
  );
}
