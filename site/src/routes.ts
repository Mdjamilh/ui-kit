import type { ComponentType } from "react";
import { ButtonPage } from "./pages/ButtonPage";
import { CheckboxPage } from "./pages/CheckboxPage";
import { Home } from "./pages/Home";
import { TextFieldPage } from "./pages/TextFieldPage";

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
];
