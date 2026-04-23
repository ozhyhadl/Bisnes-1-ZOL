import { Suspense, type ElementType, type ReactNode, useEffect, useRef, useState } from "react";

import { runWhenBrowserIdle } from "@/lib/browser-idle";

type DeferredSectionProps = {
  component: ElementType;
  fallback: ReactNode;
  rootMargin?: string;
  idleTimeout?: number;
};

const DeferredSection = ({
  component: Component,
  fallback,
  rootMargin = "720px 0px",
  idleTimeout = 1800,
}: DeferredSectionProps) => {
  const [shouldRender, setShouldRender] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shouldRender) {
      return;
    }

    const disposeIdleCallback = runWhenBrowserIdle(() => {
      setShouldRender(true);
    }, idleTimeout);

    const anchor = anchorRef.current;
    if (!anchor || typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return disposeIdleCallback;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRender(true);
        }
      },
      { rootMargin },
    );

    observer.observe(anchor);

    return () => {
      disposeIdleCallback();
      observer.disconnect();
    };
  }, [idleTimeout, rootMargin, shouldRender]);

  return (
    <div ref={anchorRef}>
      {shouldRender ? (
        <Suspense fallback={fallback}>
          <Component />
        </Suspense>
      ) : fallback}
    </div>
  );
};

export default DeferredSection;