import { useEffect, useState } from "react";

/** Current route from the URL hash, for example "#/dialog" gives "dialog". */
function readRoute(): string {
  return window.location.hash.replace(/^#\/?/, "").split(/[?#]/)[0] ?? "";
}

export function useHashRoute(): string {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
