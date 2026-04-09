import { Tab, TabList, TabPanel, Tabs } from "@mdjamilh/ui-kit";
import { KeyboardTable, PropsTable } from "../components/DocTables";
import { Example } from "../components/Example";
import { Page } from "../components/Page";

export function TabsPage() {
  return (
    <Page title="Tabs" lead="Switch between panels of related content without leaving the page.">
      <h2>Automatic activation</h2>
      <p>The panel changes as soon as a tab receives focus. Click a tab, then use the arrow keys.</p>
      <Example
        title="Automatic tabs"
        code={`
<Tabs defaultValue="account">
  <TabList aria-label="Profile settings">
    <Tab value="account">Account</Tab>
    <Tab value="password">Password</Tab>
    <Tab value="billing" disabled>Billing</Tab>
    <Tab value="alerts">Alerts</Tab>
  </TabList>
  <TabPanel value="account">...</TabPanel>
  <TabPanel value="password">...</TabPanel>
  <TabPanel value="billing">...</TabPanel>
  <TabPanel value="alerts">...</TabPanel>
</Tabs>`}
      >
        <Tabs defaultValue="account">
          <TabList aria-label="Profile settings">
            <Tab value="account">Account</Tab>
            <Tab value="password">Password</Tab>
            <Tab value="billing" disabled>
              Billing
            </Tab>
            <Tab value="alerts">Alerts</Tab>
          </TabList>
          <TabPanel value="account">Name, email and profile photo.</TabPanel>
          <TabPanel value="password">Change your password or turn on two-step sign-in.</TabPanel>
          <TabPanel value="billing">Billing is not available on the free plan.</TabPanel>
          <TabPanel value="alerts">Choose which emails you receive.</TabPanel>
        </Tabs>
      </Example>

      <h2>Manual activation, vertical</h2>
      <p>
        Arrow keys only move focus; Enter or Space shows the panel. Use this when rendering a panel is slow, so
        people can move past tabs without loading each one.
      </p>
      <Example
        title="Manual vertical tabs"
        code={`
<Tabs defaultValue="overview" activation="manual" orientation="vertical">
  <TabList aria-label="Report sections">...</TabList>
  ...
</Tabs>`}
      >
        <Tabs defaultValue="overview" activation="manual" orientation="vertical">
          <TabList aria-label="Report sections">
            <Tab value="overview">Overview</Tab>
            <Tab value="traffic">Traffic</Tab>
            <Tab value="sales">Sales</Tab>
          </TabList>
          <TabPanel value="overview">Visits are up 12% on last month.</TabPanel>
          <TabPanel value="traffic">Most visits come from search.</TabPanel>
          <TabPanel value="sales">Sales are flat week over week.</TabPanel>
        </Tabs>
      </Example>

      <h2>Accessibility</h2>
      <ul>
        <li>
          Follows the <a href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/">APG tabs pattern</a>:{" "}
          <code>tablist</code>, <code>tab</code> and <code>tabpanel</code> roles, with <code>aria-selected</code>,{" "}
          <code>aria-controls</code> and <code>aria-labelledby</code> linking each tab to its panel.
        </li>
        <li>
          Roving tabindex: only the selected tab has <code>tabindex="0"</code>, so Tab moves from the tab list
          straight into the panel instead of through every tab.
        </li>
        <li>Panels are focusable so content without focusable elements can still be reached and scrolled.</li>
        <li>Disabled tabs are skipped by the arrow keys and marked with <code>aria-disabled</code>.</li>
      </ul>

      <KeyboardTable
        rows={[
          { keys: ["Tab"], action: "Moves focus to the selected tab, then into its panel." },
          { keys: ["Right Arrow", "Left Arrow"], action: "Next or previous tab, wrapping at the ends (horizontal)." },
          { keys: ["Down Arrow", "Up Arrow"], action: "Next or previous tab, wrapping at the ends (vertical)." },
          { keys: ["Home", "End"], action: "First or last tab." },
          { keys: ["Enter", "Space"], action: "Shows the focused tab's panel (manual activation)." },
        ]}
      />

      <PropsTable
        caption="Tabs props"
        rows={[
          { name: "defaultValue", type: "string", description: "Initially selected tab. Required." },
          { name: "value", type: "string", description: "Controlled selected tab." },
          { name: "onValueChange", type: "(value: string) => void", description: "Called when the selection changes." },
          { name: "activation", type: '"automatic" | "manual"', default: '"automatic"', description: "Select on focus, or on Enter and Space." },
          { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Arrow keys and layout direction." },
        ]}
      />
      <PropsTable
        caption="TabList, Tab and TabPanel props"
        rows={[
          { name: "TabList aria-label", type: "string", description: "Names the tab list. Use this or aria-labelledby." },
          { name: "Tab value", type: "string", description: "Identifies the tab and its panel." },
          { name: "Tab disabled", type: "boolean", default: "false", description: "Skipped by the arrow keys and cannot be selected." },
          { name: "TabPanel value", type: "string", description: "Matches the Tab it belongs to. Hidden panels render no children." },
        ]}
      />
    </Page>
  );
}
