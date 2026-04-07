import type { ComponentType } from "react";
import { Home } from "./pages/Home";

export interface DocRoute {
  path: string;
  label: string;
  Component: ComponentType;
}

export const routes: DocRoute[] = [{ path: "", label: "Overview", Component: Home }];
