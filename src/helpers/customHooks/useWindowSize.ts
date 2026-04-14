import { useEffect, useState } from "react";

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

/**
 * Returns the current viewport dimensions and updates whenever the window is resized.
 *
 * Both values are `undefined` on the first server render so that SSR and client
 * renders produce the same markup (avoids hydration mismatches).
 * See: https://joshwcomeau.com/react/the-perils-of-rehydration/
 */
function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined
  });

  useEffect(() => {
    function handleResize(): void {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    window.addEventListener("resize", handleResize);

    // Populate with the initial size immediately
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

export default useWindowSize;
