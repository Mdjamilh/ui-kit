import type { ReactNode } from "react";

interface ExampleProps {
  /** Short name for the example, used as the region label. */
  title: string;
  /** Source shown under the preview. Written by hand to match the preview. */
  code: string;
  children: ReactNode;
}

export function Example({ title, code, children }: ExampleProps) {
  return (
    <section className="docs-example" aria-label={`${title} example`}>
      <div className="docs-example__preview">{children}</div>
      <details className="docs-example__source">
        <summary>Show code</summary>
        <pre className="docs-code">
          <code>{code.trim()}</code>
        </pre>
      </details>
    </section>
  );
}
