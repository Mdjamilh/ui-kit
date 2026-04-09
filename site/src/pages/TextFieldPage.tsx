import { Button, TextField } from "@mdjamilh/ui-kit";
import { useState } from "react";
import type { FormEvent } from "react";
import { KeyboardTable, PropsTable } from "../components/DocTables";
import { Example } from "../components/Example";
import { Page } from "../components/Page";

export function TextFieldPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();

  function submit(event: FormEvent) {
    event.preventDefault();
    setError(/^\S+@\S+\.\S+$/.test(email) ? undefined : "Enter an email address like name@example.com.");
  }

  return (
    <Page title="TextField" lead="A labelled text input with optional hint and error text.">
      <h2>Hint and validation</h2>
      <p>Submit the form with an invalid address to see the error state.</p>
      <Example
        title="Validation"
        code={`
<form onSubmit={submit} noValidate>
  <TextField
    label="Email"
    type="email"
    required
    hint="We only use this to send receipts."
    error={error}
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  <Button type="submit">Continue</Button>
</form>`}
      >
        <form className="docs-stack" onSubmit={submit} noValidate>
          <TextField
            label="Email"
            type="email"
            required
            hint="We only use this to send receipts."
            error={error}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </Example>

      <h2>Accessibility</h2>
      <ul>
        <li>
          The label is a real <code>&lt;label for&gt;</code>, so clicking it focuses the input and it becomes the
          accessible name. Placeholders are never used as labels.
        </li>
        <li>
          Hint and error get their own ids and are joined into <code>aria-describedby</code>. Any{" "}
          <code>aria-describedby</code> you pass is kept and comes first.
        </li>
        <li>
          With an <code>error</code>, the input gets <code>aria-invalid="true"</code> and a thicker red border, so
          the state does not rely on colour alone.
        </li>
        <li>
          The required asterisk is hidden from screen readers; the native <code>required</code> attribute is
          announced instead.
        </li>
      </ul>

      <KeyboardTable
        rows={[{ keys: ["Tab"], action: "Moves focus into and out of the input. Everything else is native text editing." }]}
      />

      <PropsTable
        rows={[
          { name: "label", type: "ReactNode", description: "Visible label. Required." },
          { name: "hint", type: "ReactNode", description: "Helper text linked with aria-describedby." },
          { name: "error", type: "ReactNode", description: "Error text. Also sets aria-invalid." },
          { name: "id", type: "string", default: "generated", description: "Input id. Generated with useId when omitted." },
          { name: "className", type: "string", description: "Class for the wrapper element." },
          { name: "ref", type: "Ref<HTMLInputElement>", description: "Forwarded to the input." },
          {
            name: "...rest",
            type: "InputHTMLAttributes",
            description: "Passed to the input (value, onChange, type, required and so on).",
          },
        ]}
      />
    </Page>
  );
}
