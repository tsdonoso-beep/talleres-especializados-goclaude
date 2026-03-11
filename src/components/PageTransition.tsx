import { useLocation } from "react-router-dom";
import { useEffect, useRef, ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only animate real page changes (path), not in-page filters (?zona)
    ref.current?.scrollTo(0, 0);

    const el = ref.current;
    if (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(3px)";
      requestAnimationFrame(() => {
        el.style.transition = "opacity 150ms ease-out, transform 150ms ease-out";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    }
  }, [location.pathname]);

  return (
    <div ref={ref} className="flex-1 flex flex-col overflow-hidden">
      {children}
    </div>
  );
}
