import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface PageProps {
  title: string;
  lead?: ReactNode;
  children: ReactNode;
}

/**
 * Wraps each docs page. On navigation the heading takes focus and the
 * document title changes, so screen reader users hear that the page changed.
 */
export function Page({ title, lead, children }: PageProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.title = title === "ui-kit" ? "ui-kit: accessible React components" : `${title} | ui-kit`;
    if (window.location.hash) headingRef.current?.focus();
  }, [title]);

  return (
    <article className="docs-page">
      <h1 ref={headingRef} tabIndex={-1}>
        {title}
      </h1>
      {lead && <p className="docs-lead">{lead}</p>}
      {children}
    </article>
  );
}
