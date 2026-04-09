import { Checkbox, Switch } from "@mdjamilh/ui-kit";
import { useState } from "react";
import { KeyboardTable, PropsTable } from "../components/DocTables";
import { Example } from "../components/Example";
import { Page } from "../components/Page";

const toppings = ["Mushrooms", "Olives", "Peppers"];

export function CheckboxPage() {
  const [picked, setPicked] = useState<string[]>(["Olives"]);
  const [wifi, setWifi] = useState(true);
  const all = picked.length === toppings.length;
  const some = picked.length > 0 && !all;

  return (
    <Page
      title="Checkbox and Switch"
      lead="Two ways to turn something on: a checkbox for choices submitted with a form, a switch for settings that apply at once."
    >
      <h2>Checkbox with a mixed state</h2>
      <Example
        title="Select all"
        code={`
<Checkbox
  label="All toppings"
  checked={all}
  indeterminate={some}
  onChange={() => setPicked(all ? [] : toppings)}
/>
{toppings.map((t) => (
  <Checkbox
    key={t}
    label={t}
    checked={picked.includes(t)}
    onChange={() => toggle(t)}
  />
))}`}
      >
        <fieldset className="docs-stack docs-fieldset">
          <legend>Toppings</legend>
          <Checkbox
            label="All toppings"
            checked={all}
            indeterminate={some}
            onChange={() => setPicked(all ? [] : toppings)}
          />
          {toppings.map((t) => (
            <Checkbox
              key={t}
              label={t}
              checked={picked.includes(t)}
              onChange={() => setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]))}
            />
          ))}
        </fieldset>
      </Example>

      <h3>With a description</h3>
      <Example
        title="Description"
        code={`<Checkbox label="Send me product news" description="About one email a month." />`}
      >
        <Checkbox label="Send me product news" description="About one email a month." />
      </Example>

      <h2>Switch</h2>
      <Example
        title="Settings"
        code={`
<Switch label="Wi-Fi" checked={wifi} onCheckedChange={setWifi} />
<Switch label="Airplane mode" description="Turns off all radios." />
<Switch label="Location" disabled />`}
      >
        <div className="docs-stack">
          <Switch label="Wi-Fi" checked={wifi} onCheckedChange={setWifi} />
          <Switch label="Airplane mode" description="Turns off all radios." />
          <Switch label="Location" disabled />
        </div>
      </Example>
      <p>Wi-Fi is {wifi ? "on" : "off"}.</p>

      <h2>Accessibility</h2>
      <ul>
        <li>
          Checkbox is a real <code>&lt;input type="checkbox"&gt;</code>, so forms, labels and Space work natively.
        </li>
        <li>
          <code>indeterminate</code> sets the DOM property, which browsers expose as "mixed". There is no HTML
          attribute for it, so it is applied in an effect.
        </li>
        <li>
          Switch is a <code>&lt;button role="switch"&gt;</code> with <code>aria-checked</code>, following the{" "}
          <a href="https://www.w3.org/WAI/ARIA/apg/patterns/switch/">APG switch pattern</a>. Its label names it
          through <code>aria-labelledby</code>, and clicking the label toggles it.
        </li>
        <li>The switch state is shown by thumb position as well as fill, and holds up in forced-colours mode.</li>
        <li>
          Group related checkboxes in a <code>&lt;fieldset&gt;</code> with a <code>&lt;legend&gt;</code>, as above.
        </li>
      </ul>

      <KeyboardTable
        rows={[
          { keys: ["Space"], action: "Toggles a checkbox or a switch." },
          { keys: ["Enter"], action: "Toggles a switch. On a checkbox, Enter submits the surrounding form, as in native HTML." },
        ]}
      />

      <PropsTable
        caption="Checkbox props"
        rows={[
          { name: "label", type: "ReactNode", description: "Visible label. Required." },
          { name: "description", type: "ReactNode", description: "Secondary text linked with aria-describedby." },
          { name: "indeterminate", type: "boolean", default: "false", description: "Shows and announces the mixed state." },
          { name: "checked, defaultChecked, onChange", type: "native", description: "Same as a native checkbox." },
          { name: "ref", type: "Ref<HTMLInputElement>", description: "Forwarded to the input." },
        ]}
      />

      <PropsTable
        caption="Switch props"
        rows={[
          { name: "label", type: "ReactNode", description: "Visible label. Required." },
          { name: "checked", type: "boolean", description: "Controlled state." },
          { name: "defaultChecked", type: "boolean", default: "false", description: "Initial state when uncontrolled." },
          { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Called with the new state." },
          { name: "description", type: "ReactNode", description: "Secondary text linked with aria-describedby." },
          { name: "name", type: "string", description: 'Adds a hidden input carrying "on" in form data while checked.' },
          { name: "disabled", type: "boolean", default: "false", description: "Disables the switch." },
        ]}
      />
    </Page>
  );
}
