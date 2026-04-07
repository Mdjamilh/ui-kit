import { Page } from "../components/Page";

export function Home() {
  return (
    <Page title="ui-kit" lead="A small set of React components that work with a keyboard, a screen reader and a mouse.">
      <p>
        Each component follows the matching pattern in the{" "}
        <a href="https://www.w3.org/WAI/ARIA/apg/patterns/">WAI-ARIA Authoring Practices Guide</a>. Every page
        below has a live example, the props, and the keys it responds to. Try them without a mouse.
      </p>
      <h2>Install</h2>
      <p>The package is not on npm. Install it straight from GitHub; npm runs the build on install.</p>
      <pre className="docs-code">
        <code>npm install github:Mdjamilh/ui-kit</code>
      </pre>
      <pre className="docs-code">
        <code>{`import "@mdjamilh/ui-kit/styles.css";
import { Button } from "@mdjamilh/ui-kit";

export function Save() {
  return <Button onClick={save}>Save</Button>;
}`}</code>
      </pre>
    </Page>
  );
}
