import { Button } from "@mdjamilh/ui-kit";
import { Example } from "../components/Example";
import { Page } from "../components/Page";

const colorTokens = [
  ["--uk-color-bg", "Page background"],
  ["--uk-color-surface", "Subtle fills: hover states, code blocks"],
  ["--uk-color-surface-raised", "Inputs, dialogs, toasts"],
  ["--uk-color-text", "Body text"],
  ["--uk-color-text-muted", "Hints and secondary text"],
  ["--uk-color-border", "Dividers"],
  ["--uk-color-border-strong", "Input borders (meets 3:1 against the background)"],
  ["--uk-color-primary", "Primary buttons, links, selected tabs"],
  ["--uk-color-danger", "Errors and destructive actions"],
  ["--uk-color-success", "Success toasts"],
  ["--uk-color-focus", "Focus outlines"],
];

export function ThemingPage() {
  return (
    <Page title="Theming" lead="Every colour, space and radius is a CSS variable, so a theme is a block of overrides.">
      <h2>Light and dark</h2>
      <p>
        The light theme is the default. The dark theme applies when the operating system prefers dark, unless the
        page sets <code>data-theme="light"</code> on <code>&lt;html&gt;</code>. Setting{" "}
        <code>data-theme="dark"</code> forces dark. The theme menu at the top of this site does exactly that.
      </p>
      <pre className="docs-code">
        <code>{`<html data-theme="dark">   <!-- always dark -->
<html data-theme="light">  <!-- always light -->
<html>                     <!-- follows the system -->`}</code>
      </pre>

      <h2>Colour tokens</h2>
      <div className="docs-table-wrap">
        <table className="docs-table">
          <caption>Colour tokens in the current theme</caption>
          <thead>
            <tr>
              <th scope="col">Swatch</th>
              <th scope="col">Token</th>
              <th scope="col">Used for</th>
            </tr>
          </thead>
          <tbody>
            {colorTokens.map(([token, use]) => (
              <tr key={token}>
                <td>
                  <span className="docs-swatch" style={{ background: `var(${token})` }} aria-hidden="true" />
                </td>
                <th scope="row">
                  <code>{token}</code>
                </th>
                <td>{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Both themes were checked for WCAG AA contrast: text tokens reach at least 4.5:1 on the background and
        surfaces, and borders and focus rings reach 3:1. The browser tests run axe on every page in both themes.
      </p>

      <h2>Making your own theme</h2>
      <p>Override tokens on any element. Components inside pick up the new values.</p>
      <Example
        title="Custom theme"
        code={`
.brand-green {
  --uk-color-primary: #116b4a;
  --uk-color-primary-hover: #0b5137;
  --uk-color-focus: #116b4a;
  --uk-radius-md: 999px;
}`}
      >
        <div className="docs-brand-green">
          <Button>Rounded green</Button>
        </div>
        <Button>Default</Button>
      </Example>

      <h2>Motion</h2>
      <p>
        Transitions read <code>--uk-duration</code>, which drops to 0 when the user asks for reduced motion. The
        loading spinner slows down instead of stopping, so it still shows progress.
      </p>
    </Page>
  );
}
