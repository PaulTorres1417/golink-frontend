import { useEffect, useState } from "react";

export const useSidebarWidth = () => {
  const [width, setWidth] = useState(350);

  useEffect(() => {
    const calculate = () => {
      const vw = window.innerWidth;
      if (vw >= 1440) {
        setWidth(350);
      } else if (vw >= 1265) {
        const ratio = (vw - 1265) / (1440 - 1265);
        setWidth(Math.round(335 + ratio * (350 - 335)));
      } else if (vw >= 700) {
        const ratio = (vw - 700) / (1270 - 700);
        const fastRatio = Math.pow(ratio, 2);
        setWidth(Math.round(88 + fastRatio * (200 - 88)));
      } else {
        setWidth(70);
      }
    };
    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, []);

  return width;
};