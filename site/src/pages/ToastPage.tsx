import { Button, useToast } from "@mdjamilh/ui-kit";
import { KeyboardTable, PropsTable } from "../components/DocTables";
import { Example } from "../components/Example";
import { Page } from "../components/Page";

export function ToastPage() {
  const { toast } = useToast();

  return (
    <Page title="Toast" lead="Brief messages about something that just happened, shown in the corner of the screen.">
      <h2>Tones</h2>
      <Example
        title="Toasts"
        code={`
// Once, near the root of the app:
<ToastProvider>
  <App />
</ToastProvider>

// Anywhere below it:
const { toast } = useToast();
toast({ title: "Message sent" });
toast({ title: "Draft saved", description: "Saved 2 minutes ago", tone: "success" });
toast({ title: "Upload failed", description: "The file is over 10 MB.", tone: "error" });
toast({ title: "Stays until dismissed", duration: Infinity });`}
      >
        <Button variant="secondary" onClick={() => toast({ title: "Message sent" })}>
          Info
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast({ title: "Draft saved", description: "Saved 2 minutes ago", tone: "success" })}
        >
          Success
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast({ title: "Upload failed", description: "The file is over 10 MB.", tone: "error" })}
        >
          Error
        </Button>
        <Button variant="secondary" onClick={() => toast({ title: "Stays until dismissed", duration: Infinity })}>
          Persistent
        </Button>
      </Example>

      <h2>Accessibility</h2>
      <ul>
        <li>
          Toasts render inside a labelled <code>region</code> ("Notifications") with two live regions that exist from
          the first render. Live regions added at the same moment as their text are often not announced, so they
          are never created on demand.
        </li>
        <li>
          Info and success toasts go to the <code>aria-live="polite"</code> list and wait for the screen reader to
          finish. Errors go to the <code>assertive</code> list and interrupt.
        </li>
        <li>
          Auto-dismiss pauses while the pointer is over the notifications or focus is inside them, and resumes with
          the time that was left. This gives people time to read and reach the dismiss button (WCAG 2.2.1).
        </li>
        <li>Toasts never take focus, so they do not interrupt typing.</li>
        <li>
          Do not put the only copy of important information in a toast. Anything people must act on belongs in the
          page or in a dialog.
        </li>
      </ul>

      <KeyboardTable
        rows={[
          { keys: ["Tab"], action: "Reaches each toast's dismiss button after the page content. Timers pause while focus is there." },
          { keys: ["Enter", "Space"], action: "Dismisses the focused toast." },
        ]}
      />

      <PropsTable
        caption="toast() options"
        rows={[
          { name: "title", type: "ReactNode", description: "Main message. Required." },
          { name: "description", type: "ReactNode", description: "Secondary line." },
          { name: "tone", type: '"info" | "success" | "error"', default: '"info"', description: "Colour and politeness. Errors are assertive." },
          { name: "duration", type: "number", default: "provider duration", description: "Milliseconds before closing. Infinity keeps it open." },
        ]}
      />
      <PropsTable
        caption="ToastProvider props"
        rows={[
          { name: "duration", type: "number", default: "5000", description: "Default auto-dismiss time." },
          { name: "label", type: "string", default: '"Notifications"', description: "Accessible name of the region." },
          { name: "dismissLabel", type: "string", default: '"Dismiss notification"', description: "Label of each dismiss button." },
        ]}
      />
      <p>
        <code>useToast()</code> returns <code>{"{ toast, dismiss }"}</code>. <code>toast</code> returns an id you can
        pass to <code>dismiss</code>.
      </p>
    </Page>
  );
}
