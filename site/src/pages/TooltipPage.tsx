import { Button, Tooltip } from "@mdjamilh/ui-kit";
import { KeyboardTable, PropsTable } from "../components/DocTables";
import { Example } from "../components/Example";
import { Page } from "../components/Page";

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TooltipPage() {
  return (
    <Page title="Tooltip" lead="A short hint that appears when a control is hovered or focused.">
      <h2>Toolbar hints</h2>
      <p>Tab to a button or hover it. The tooltip adds a description; the button still needs its own name.</p>
      <Example
        title="Tooltip"
        code={`
<Tooltip content="Ctrl+B">
  <Button variant="secondary" aria-label="Bold">
    <BoldIcon />
  </Button>
</Tooltip>
<Tooltip content="Shows below" placement="bottom">
  <Button variant="secondary">Bottom</Button>
</Tooltip>`}
      >
        <Tooltip content="Ctrl+B">
          <Button variant="secondary" aria-label="Bold">
            <Icon d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />
          </Button>
        </Tooltip>
        <Tooltip content="Ctrl+I">
          <Button variant="secondary" aria-label="Italic">
            <Icon d="M14 5h-4M14 19h-4M14 5l-4 14" />
          </Button>
        </Tooltip>
        <Tooltip content="Shows below the trigger" placement="bottom">
          <Button variant="secondary">Bottom</Button>
        </Tooltip>
      </Example>

      <h2>Accessibility</h2>
      <ul>
        <li>
          Follows the <a href="https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/">APG tooltip pattern</a>: the
          bubble has <code>role="tooltip"</code> and the trigger points to it with <code>aria-describedby</code>.
        </li>
        <li>
          The text stays in the DOM while hidden, so screen readers read it as the description without anyone
          needing to hover.
        </li>
        <li>
          Meets WCAG 1.4.13 (content on hover or focus): it can be dismissed with Escape, it stays open while the
          pointer moves onto it, and it stays until focus or the pointer leaves.
        </li>
        <li>Hover waits 300 ms to avoid flicker; keyboard focus shows it at once.</li>
        <li>Do not put links or buttons inside a tooltip. Use a dialog or a disclosure for interactive content.</li>
      </ul>

      <KeyboardTable
        rows={[
          { keys: ["Tab"], action: "Focusing the trigger shows the tooltip; moving focus away hides it." },
          { keys: ["Escape"], action: "Hides the tooltip while focus stays on the trigger." },
        ]}
      />

      <PropsTable
        rows={[
          { name: "content", type: "ReactNode", description: "Tooltip text. Required." },
          { name: "children", type: "ReactElement", description: "One focusable element. It receives aria-describedby." },
          { name: "placement", type: '"top" | "bottom"', default: '"top"', description: "Side the bubble appears on." },
          { name: "delay", type: "number", default: "300", description: "Hover delay in milliseconds." },
          { name: "className", type: "string", description: "Class for the wrapper." },
        ]}
      />
    </Page>
  );
}
