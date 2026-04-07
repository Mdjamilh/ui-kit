import { ToastProvider } from "@mdjamilh/ui-kit";
import type { MouseEvent } from "react";
import { ThemePicker } from "./components/ThemePicker";
import { useHashRoute } from "./router";
import { routes } from "./routes";

export function App() {
  const route = useHashRoute();
  const current = routes.find((r) => r.path === route);

  return (
    <ToastProvider>
      <a className="docs-skip" href="#main" onClick={skipToMain}>
        Skip to content
      </a>
      <header className="docs-header">
        <a className="docs-brand" href="#/">
          ui-kit
        </a>
        <ThemePicker />
      </header>
      <div className="docs-layout">
        <nav className="docs-nav" aria-label="Components">
          <ul>
            {routes.map((r) => (
              <li key={r.path}>
                <a href={`#/${r.path}`} aria-current={r === current ? "page" : undefined}>
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <main id="main" className="docs-main" tabIndex={-1}>
          {current ? <current.Component /> : <NotFound />}
        </main>
      </div>
    </ToastProvider>
  );
}

/** Hash routing owns the URL fragment, so the skip link moves focus by hand. */
function skipToMain(event: MouseEvent) {
  event.preventDefault();
  document.getElementById("main")?.focus();
}

function NotFound() {
  return (
    <article className="docs-page">
      <h1>Page not found</h1>
      <p>
        <a href="#/">Go to the overview</a>
      </p>
    </article>
  );
}
