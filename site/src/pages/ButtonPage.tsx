import { Button, useToast } from "@mdjamilh/ui-kit";
import { useState } from "react";
import { KeyboardTable, PropsTable } from "../components/DocTables";
import { Example } from "../components/Example";
import { Page } from "../components/Page";

export function ButtonPage() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  function save() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({ title: "Saved", tone: "success" });
    }, 1500);
  }

  return (
    <Page title="Button" lead="A native button with four variants, three sizes and a loading state.">
      <h2>Variants</h2>
      <Example
        title="Variants"
        code={`
<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Delete</Button>`}
      >
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Delete</Button>
      </Example>

      <h2>Sizes</h2>
      <Example
        title="Sizes"
        code={`
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
      >
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </Example>

      <h2>Loading</h2>
      <p>
        While <code>loading</code> is true the button keeps focus but ignores clicks. It sets{" "}
        <code>aria-busy</code> and <code>aria-disabled</code> instead of <code>disabled</code>, because a disabled
        button drops keyboard focus to the page body.
      </p>
      <Example
        title="Loading"
        code={`
<Button loading={saving} onClick={save}>
  Save changes
</Button>`}
      >
        <Button loading={saving} onClick={save}>
          Save changes
        </Button>
      </Example>

      <h2>Accessibility</h2>
      <ul>
        <li>
          Renders a real <code>&lt;button&gt;</code> with <code>type="button"</code> by default, so it never
          submits a form by accident.
        </li>
        <li>The spinner is hidden from assistive tech; a visually hidden "Loading" is added to the name instead.</li>
        <li>Focus is shown with a 2px outline that follows the theme's focus colour.</li>
      </ul>

      <KeyboardTable
        rows={[
          { keys: ["Enter", "Space"], action: "Activates the button (ignored while loading)." },
          { keys: ["Tab"], action: "Moves focus to and from the button. A loading button stays in the tab order." },
        ]}
      />

      <PropsTable
        rows={[
          { name: "variant", type: '"primary" | "secondary" | "ghost" | "danger"', default: '"primary"', description: "Visual style." },
          { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Height and padding." },
          { name: "loading", type: "boolean", default: "false", description: "Shows a spinner and blocks activation." },
          { name: "loadingLabel", type: "string", default: '"Loading"', description: "Text appended to the accessible name while loading." },
          { name: "type", type: '"button" | "submit" | "reset"', default: '"button"', description: "Native button type." },
          { name: "ref", type: "Ref<HTMLButtonElement>", description: "Forwarded to the button element." },
          { name: "...rest", type: "ButtonHTMLAttributes", description: "Any other native button attribute." },
        ]}
      />
    </Page>
  );
}
