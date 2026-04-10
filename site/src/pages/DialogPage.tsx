import { Button, Dialog, TextField, useToast } from "@mdjamilh/ui-kit";
import { useRef, useState } from "react";
import { KeyboardTable, PropsTable } from "../components/DocTables";
import { Example } from "../components/Example";
import { Page } from "../components/Page";

export function DialogPage() {
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Page title="Dialog" lead="A modal window that keeps focus inside until it is closed.">
      <h2>Form in a dialog</h2>
      <Example
        title="Edit profile dialog"
        code={`
const nameRef = useRef<HTMLInputElement>(null);

<Button onClick={() => setOpen(true)}>Edit profile</Button>
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Edit profile"
  description="Changes are visible to your team."
  initialFocus={nameRef}
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={save}>Save</Button>
    </>
  }
>
  <TextField label="Display name" ref={nameRef} />
  <TextField label="Job title" />
</Dialog>`}
      >
        <Button onClick={() => setEditOpen(true)}>Edit profile</Button>
        <Dialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          title="Edit profile"
          description="Changes are visible to your team."
          initialFocus={nameRef}
          footer={
            <>
              <Button variant="secondary" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setEditOpen(false);
                  toast({ title: "Profile saved", tone: "success" });
                }}
              >
                Save
              </Button>
            </>
          }
        >
          <div className="docs-stack">
            <TextField label="Display name" defaultValue="Sam Rivera" ref={nameRef} />
            <TextField label="Job title" defaultValue="Designer" />
          </div>
        </Dialog>
      </Example>

      <h2>Confirming a destructive action</h2>
      <p>
        Focus starts on Cancel, the least destructive choice, as the APG recommends. The backdrop does not close
        this one, so a stray click cannot dismiss a question that needs an answer.
      </p>
      <Example
        title="Delete confirmation dialog"
        code={`
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Delete project?"
  description="This removes 14 files. You cannot undo this."
  size="sm"
  initialFocus={cancelRef}
  closeOnBackdropClick={false}
  footer={...}
/>`}
      >
        <Button variant="danger" onClick={() => setConfirmOpen(true)}>
          Delete project
        </Button>
        <Dialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title="Delete project?"
          description="This removes 14 files. You cannot undo this."
          size="sm"
          initialFocus={cancelRef}
          closeOnBackdropClick={false}
          footer={
            <>
              <Button variant="secondary" ref={cancelRef} onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setConfirmOpen(false);
                  toast({ title: "Project deleted", tone: "error" });
                }}
              >
                Delete
              </Button>
            </>
          }
        />
      </Example>

      <h2>Accessibility</h2>
      <ul>
        <li>
          <code>role="dialog"</code> with <code>aria-modal="true"</code>, named by its title and described by its
          description, following the <a href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/">APG modal dialog pattern</a>.
        </li>
        <li>
          On open, focus moves to <code>initialFocus</code> or the first focusable element. Tab and Shift+Tab wrap
          inside the dialog. If focus escapes, for example after a click on the backdrop, it is pulled back.
        </li>
        <li>On close, focus returns to the element that opened the dialog.</li>
        <li>
          The page behind stops scrolling, and the scrollbar width is replaced with padding so the layout does not
          shift. Nested dialogs share the lock and close one at a time.
        </li>
        <li>The dialog is rendered in a portal on <code>document.body</code>, so parent overflow and z-index do not clip it.</li>
      </ul>

      <KeyboardTable
        rows={[
          { keys: ["Tab"], action: "Next focusable element inside the dialog, wrapping from last to first." },
          { keys: ["Shift + Tab"], action: "Previous focusable element, wrapping from first to last." },
          { keys: ["Escape"], action: "Closes the dialog and returns focus to the trigger." },
        ]}
      />

      <PropsTable
        rows={[
          { name: "open", type: "boolean", description: "Whether the dialog is shown. Required." },
          { name: "onClose", type: "() => void", description: "Called on Escape, the close button or a backdrop click. Required." },
          { name: "title", type: "ReactNode", description: "Heading and accessible name. Required." },
          { name: "description", type: "ReactNode", description: "Text under the title, used as the accessible description." },
          { name: "initialFocus", type: "RefObject<HTMLElement>", description: "Element to focus on open." },
          { name: "closeOnBackdropClick", type: "boolean", default: "true", description: "Close when the dimmed area is clicked." },
          { name: "closeLabel", type: "string", default: '"Close"', description: "Accessible label of the X button." },
          { name: "footer", type: "ReactNode", description: "Actions shown at the bottom." },
          { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Maximum width." },
        ]}
      />
    </Page>
  );
}
