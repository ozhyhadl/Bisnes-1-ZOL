import { runWhenBrowserIdle } from "@/lib/browser-idle";

type FbqFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  push?: (...args: unknown[]) => number;
  loaded?: boolean;
  version?: string;
};

type WindowWithMarketingScripts = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: FbqFunction;
  _fbq?: FbqFunction;
  __aicbGtmPrimed?: boolean;
  __aicbGaPrimed?: boolean;
  __aicbMetaPixelPrimed?: boolean;
  __aicbMarketingScriptsLoaded?: boolean;
};

const GTM_CONTAINER_ID = "GTM-N55PLNHK";
const GA_MEASUREMENT_ID = "G-J8H56YCJD2";
const META_PIXEL_ID = "1687132965983563";

const GTM_SCRIPT_ID = "aicb-gtm-script";
const GA_SCRIPT_ID = "aicb-ga-script";
const META_PIXEL_SCRIPT_ID = "aicb-meta-pixel-script";

function appendExternalScript(scriptId: string, src: string): void {
  if (typeof document === "undefined" || document.getElementById(scriptId)) {
    return;
  }

  const script = document.createElement("script");
  script.id = scriptId;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function primeGoogleTracking(marketingWindow: WindowWithMarketingScripts): void {
  marketingWindow.dataLayer = marketingWindow.dataLayer ?? [];

  if (!marketingWindow.gtag) {
    marketingWindow.gtag = (...args: unknown[]) => {
      marketingWindow.dataLayer?.push(args);
    };
  }

  if (!marketingWindow.__aicbGtmPrimed) {
    marketingWindow.dataLayer.push({
      "gtm.start": Date.now(),
      event: "gtm.js",
    });
    marketingWindow.__aicbGtmPrimed = true;
  }

  if (!marketingWindow.__aicbGaPrimed) {
    marketingWindow.gtag("js", new Date());
    marketingWindow.gtag("config", GA_MEASUREMENT_ID);
    marketingWindow.__aicbGaPrimed = true;
  }
}

function primeMetaPixel(marketingWindow: WindowWithMarketingScripts): void {
  if (!marketingWindow.fbq) {
    const fbq = ((...args: unknown[]) => {
      if (fbq.callMethod) {
        fbq.callMethod(...args);
        return;
      }

      fbq.queue?.push(args);
    }) as FbqFunction;

    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.push = (...args: unknown[]) => {
      fbq(...args);
      return fbq.queue?.length ?? 0;
    };

    marketingWindow.fbq = fbq;
    marketingWindow._fbq = fbq;
  }

  if (!marketingWindow.__aicbMetaPixelPrimed) {
    marketingWindow.fbq("init", META_PIXEL_ID);
    marketingWindow.fbq("track", "PageView");
    marketingWindow.__aicbMetaPixelPrimed = true;
  }
}

function loadMarketingScripts(marketingWindow: WindowWithMarketingScripts): void {
  if (marketingWindow.__aicbMarketingScriptsLoaded) {
    return;
  }

  marketingWindow.__aicbMarketingScriptsLoaded = true;

  appendExternalScript(
    GTM_SCRIPT_ID,
    `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`,
  );
  appendExternalScript(
    GA_SCRIPT_ID,
    `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
  );
  appendExternalScript(
    META_PIXEL_SCRIPT_ID,
    "https://connect.facebook.net/en_US/fbevents.js",
  );
}

export function scheduleMarketingScriptsLoad(): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const marketingWindow = window as WindowWithMarketingScripts;
  primeGoogleTracking(marketingWindow);
  primeMetaPixel(marketingWindow);

  let listenersRemoved = false;

  const tearDownInteractionListeners = () => {
    if (listenersRemoved) {
      return;
    }

    listenersRemoved = true;
    window.removeEventListener("pointerdown", handleInteraction);
    window.removeEventListener("touchstart", handleInteraction);
    window.removeEventListener("keydown", handleInteraction);
  };

  const loadNow = () => {
    loadMarketingScripts(marketingWindow);
    tearDownInteractionListeners();
  };

  const handleInteraction = () => {
    loadNow();
  };

  window.addEventListener("pointerdown", handleInteraction, { passive: true });
  window.addEventListener("touchstart", handleInteraction, { passive: true });
  window.addEventListener("keydown", handleInteraction);

  const cancelIdleCallback = runWhenBrowserIdle(() => {
    loadNow();
  }, 3500);

  return () => {
    cancelIdleCallback();
    tearDownInteractionListeners();
  };
}