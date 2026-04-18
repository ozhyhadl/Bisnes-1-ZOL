type IdleDeadlineLike = {
  didTimeout: boolean;
  timeRemaining: () => number;
};

type IdleCallbackHandle = number;
type IdleCallbackLike = (deadline: IdleDeadlineLike) => void;

type WindowWithIdleCallback = Window & {
  requestIdleCallback?: (
    callback: IdleCallbackLike,
    options?: { timeout?: number },
  ) => IdleCallbackHandle;
  cancelIdleCallback?: (handle: IdleCallbackHandle) => void;
};

export function runWhenBrowserIdle(
  callback: () => void,
  timeout = 1500,
): () => void {
  if (typeof window === "undefined") {
    callback();
    return () => {};
  }

  const idleWindow = window as WindowWithIdleCallback;

  if (typeof idleWindow.requestIdleCallback === "function") {
    const handle = idleWindow.requestIdleCallback(() => {
      callback();
    }, { timeout });

    return () => {
      idleWindow.cancelIdleCallback?.(handle);
    };
  }

  const handle = window.setTimeout(callback, 1);
  return () => {
    window.clearTimeout(handle);
  };
}