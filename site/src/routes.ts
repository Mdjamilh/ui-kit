import type { ComponentType } from "react";
import { ButtonPage } from "./pages/ButtonPage";
import { CheckboxPage } from "./pages/CheckboxPage";
import { DialogPage } from "./pages/DialogPage";
import { Home } from "./pages/Home";
import { SelectPage } from "./pages/SelectPage";
import { TabsPage } from "./pages/TabsPage";
import { TextFieldPage } from "./pages/TextFieldPage";
import { ThemingPage } from "./pages/ThemingPage";
import { ToastPage } from "./pages/ToastPage";
import { TooltipPage } from "./pages/TooltipPage";

export interface DocRoute {
  path: string;
  label: string;
  Component: ComponentType;
}

export const routes: DocRoute[] = [
  { path: "", label: "Overview", Component: Home },
  { path: "button", label: "Button", Component: ButtonPage },
  { path: "text-field", label: "TextField", Component: TextFieldPage },
  { path: "checkbox-switch", label: "Checkbox and Switch", Component: CheckboxPage },
  { path: "tabs", label: "Tabs", Component: TabsPage },
  { path: "dialog", label: "Dialog", Component: DialogPage },
  { path: "tooltip", label: "Tooltip", Component: TooltipPage },
  { path: "toast", label: "Toast", Component: ToastPage },
  { path: "select", label: "Select", Component: SelectPage },
  { path: "theming", label: "Theming", Component: ThemingPage },
];
