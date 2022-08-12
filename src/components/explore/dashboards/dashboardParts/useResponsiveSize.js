import { useEffect, useRef, useState } from "react";

/**
 * Hook for getting the size of a box, that updates when resizing
 * Returns the size ({height, width}) and a ref to set on the targeted box
 */
const useResponsiveSize = () => {
  const [size, setSize] = useState({ height: 500, width: 1000 });
  const [delayedSize, setDelayedSize] = useState(null);
  const box: any = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (delayedSize) setSize(delayedSize);
    }, 500);
    return () => clearTimeout(timer);
  }, [setSize, delayedSize]);

  useEffect(() => {
    updateSize(box, setSize);
    window.addEventListener("resize", () => updateSize(box, setDelayedSize));
    return () => window.removeEventListener("resize", () => updateSize(box, setDelayedSize));
  }, []);

  return [size, box];
};

const updateSize = (box, setSize) => {
  setSize((size) => {
    if (!box.current) return size;
    const height = Math.min(window.innerHeight, box.current.clientHeight);
    const width = Math.min(window.innerWidth, box.current.clientWidth);
    if (size?.height === height && size?.width === width) return size;
    return { width, height };
  });
};

export default useResponsiveSize;
