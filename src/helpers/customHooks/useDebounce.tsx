import { useEffect, DependencyList } from "react";

export const useDebouncedEffect = (
  effect: () => void,
  deps: DependencyList | undefined,
  delay: number
): void => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || []), delay]);
};
