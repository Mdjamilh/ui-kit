// Bundles an app that imports only Button from the built ESM output and
// checks that code from the other components was dropped.
import { build } from "esbuild";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

const result = await build({
  stdin: {
    contents: 'import { Button } from "./dist/index.js"; console.log(Button);',
    resolveDir: root,
    loader: "js",
  },
  bundle: true,
  write: false,
  minify: true,
  format: "esm",
  external: ["react", "react-dom", "react/jsx-runtime"],
});

const code = result.outputFiles[0].text;
const leaked = ["uk-dialog", "uk-select", "uk-toast", "uk-tabs", "uk-tooltip", "uk-switch"].filter((name) =>
  code.includes(name),
);

console.log(`Button-only bundle: ${code.length} bytes`);
if (!code.includes("uk-button")) {
  console.error("Button code is missing from the bundle");
  process.exit(1);
}
if (leaked.length > 0) {
  console.error(`Not tree-shaken, found: ${leaked.join(", ")}`);
  process.exit(1);
}
console.log("Tree-shaking OK: unused components were removed.");
