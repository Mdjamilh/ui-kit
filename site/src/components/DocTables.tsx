import type { ReactNode } from "react";

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: ReactNode;
}

export function PropsTable({ rows, caption = "Props" }: { rows: PropRow[]; caption?: string }) {
  return (
    <div className="docs-table-wrap">
      <table className="docs-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <th scope="row">
                <code>{row.name}</code>
              </th>
              <td>
                <code>{row.type}</code>
              </td>
              <td>{row.default ? <code>{row.default}</code> : <span aria-label="none">-</span>}</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface KeyRow {
  keys: string[];
  action: ReactNode;
}

export function KeyboardTable({ rows, caption = "Keyboard" }: { rows: KeyRow[]; caption?: string }) {
  return (
    <div className="docs-table-wrap">
      <table className="docs-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Key</th>
            <th scope="col">What it does</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.keys.join("+")}>
              <th scope="row">
                {row.keys.map((key, i) => (
                  <span key={key}>
                    {i > 0 && " or "}
                    <kbd>{key}</kbd>
                  </span>
                ))}
              </th>
              <td>{row.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
