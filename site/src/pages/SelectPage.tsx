import { Select } from "@mdjamilh/ui-kit";
import { useState } from "react";
import { KeyboardTable, PropsTable } from "../components/DocTables";
import { Example } from "../components/Example";
import { Page } from "../components/Page";

const timezones = [
  { value: "utc-8", label: "Pacific Time (UTC-8)" },
  { value: "utc-5", label: "Eastern Time (UTC-5)" },
  { value: "utc+0", label: "Greenwich Mean Time (UTC+0)" },
  { value: "utc+1", label: "Central European Time (UTC+1)" },
  { value: "utc+3", label: "Moscow Time (UTC+3)", disabled: true },
  { value: "utc+5.5", label: "India Standard Time (UTC+5:30)" },
  { value: "utc+6", label: "Bangladesh Standard Time (UTC+6)" },
  { value: "utc+8", label: "China Standard Time (UTC+8)" },
  { value: "utc+9", label: "Japan Standard Time (UTC+9)" },
  { value: "utc+10", label: "Australian Eastern Time (UTC+10)" },
];

export function SelectPage() {
  const [zone, setZone] = useState<string | null>(null);

  return (
    <Page title="Select" lead="Pick one option from a list, using the select-only combobox pattern.">
      <Example
        title="Time zone select"
        code={`
<Select
  label="Time zone"
  hint="Used for meeting reminders."
  placeholder="Choose a time zone"
  options={timezones}
  value={zone}
  onValueChange={setZone}
  name="timezone"
/>`}
      >
        <Select
          label="Time zone"
          hint="Used for meeting reminders."
          placeholder="Choose a time zone"
          options={timezones}
          value={zone}
          onValueChange={setZone}
          name="timezone"
        />
      </Example>
      <p>Selected value: {zone ? <code>{zone}</code> : "none"}</p>

      <h2>Why not a native select?</h2>
      <p>
        A native <code>&lt;select&gt;</code> is the most robust choice and is usually the right one. This component
        exists for cases where the options need custom styling, and it copies the native keyboard behaviour as
        closely as the APG pattern allows.
      </p>

      <h2>Accessibility</h2>
      <ul>
        <li>
          Follows the{" "}
          <a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/">
            APG select-only combobox
          </a>
          : a focusable <code>combobox</code> with <code>aria-expanded</code>, <code>aria-controls</code> and{" "}
          <code>aria-haspopup="listbox"</code>, and a <code>listbox</code> of <code>option</code>s.
        </li>
        <li>
          Focus never leaves the combobox. The highlighted option is exposed with{" "}
          <code>aria-activedescendant</code>, and the chosen one with <code>aria-selected</code>.
        </li>
        <li>Disabled options are skipped by the arrow keys and by typeahead, and cannot be clicked.</li>
        <li>The list closes when focus leaves, and the highlighted option scrolls into view.</li>
      </ul>

      <KeyboardTable
        caption="Keyboard while closed"
        rows={[
          { keys: ["Down Arrow", "Up Arrow", "Enter", "Space"], action: "Opens the list on the selected option." },
          { keys: ["Home", "End"], action: "Opens the list on the first or last option." },
          { keys: ["A-Z"], action: "Opens the list on the first option starting with the typed text." },
        ]}
      />
      <KeyboardTable
        caption="Keyboard while open"
        rows={[
          { keys: ["Down Arrow", "Up Arrow"], action: "Next or previous option. Stops at the ends." },
          { keys: ["Home", "End"], action: "First or last option." },
          { keys: ["Page Down", "Page Up"], action: "Jumps ten options." },
          { keys: ["Enter", "Space"], action: "Chooses the highlighted option and closes." },
          { keys: ["Tab"], action: "Chooses the highlighted option and moves focus on." },
          { keys: ["Alt + Up Arrow"], action: "Chooses the highlighted option and closes." },
          { keys: ["Escape"], action: "Closes without changing the value." },
          { keys: ["A-Z"], action: "Jumps to a matching option. Repeating a letter cycles through options with that initial." },
        ]}
      />

      <PropsTable
        rows={[
          { name: "label", type: "ReactNode", description: "Visible label. Required." },
          { name: "options", type: "{ value: string; label: string; disabled?: boolean }[]", description: "Choices. Required." },
          { name: "value", type: "string | null", description: "Controlled value." },
          { name: "defaultValue", type: "string | null", default: "null", description: "Initial value when uncontrolled." },
          { name: "onValueChange", type: "(value: string) => void", description: "Called when an option is chosen." },
          { name: "placeholder", type: "string", default: '"Select an option"', description: "Shown when nothing is chosen." },
          { name: "hint", type: "ReactNode", description: "Helper text linked with aria-describedby." },
          { name: "name", type: "string", description: "Adds a hidden input so the value is submitted with forms." },
          { name: "disabled", type: "boolean", default: "false", description: "Removes it from the tab order and blocks opening." },
        ]}
      />
    </Page>
  );
}
