import { useEffect, useCallback, useState } from "react";

/**
 * Hook for getting the size of a box, that updates when resizing
 * Returns the size ({height, width}) and a ref to set on the targeted box
 */
const useResponsiveSize = () => {
  const [size, setSize] = useState({ height: 500, width: 1000 });
  const [delayedSize, setDelayedSize] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (delayedSize) setSize(delayedSize);
    }, 500);
    return () => clearTimeout(timer);
  }, [setSize, delayedSize]);

  const box = useCallback((node) => {
    updateSize(node, setSize);
    window.addEventListener("resize", () => updateSize(node, setDelayedSize));
    return () => window.removeEventListener("resize", () => updateSize(node, setDelayedSize));
  }, []);

  return [size, box];
};

const updateSize = (el, setSize) => {
  setSize((size) => {
    if (!el) return size;
    const height = Math.min(window.innerHeight, el.clientHeight);
    const width = Math.min(window.innerWidth, el.clientWidth);
    if (size?.height === height && size?.width === width) return size;
    return { width, height };
  });
};

export default useResponsiveSize;
