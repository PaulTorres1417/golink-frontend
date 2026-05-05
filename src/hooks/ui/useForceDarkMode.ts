import { useEffect } from "react";

export const useForceDarkMode = () => {

  useEffect(() => {
    const html = document.documentElement;
    const prevTheme = html.getAttribute("data-theme");
    const prevBg = document.body.style.background;

    html.setAttribute("data-theme", "dark");
    document.body.style.background = "#131420";

    return () => {
      if (prevTheme) {
        html.setAttribute("data-theme", prevTheme);
      } else {
        html.removeAttribute("data-theme");
      }
      document.body.style.background = prevBg;
    };
  }, []);
}