import { setSmallScreen } from "actions";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SetState, WindowSize } from "types";

const smallScreenSize = 700;

export default function useWindowSize() {
  const dispatch = useDispatch();
  const [size, setSize] = useState<WindowSize>({
    height: window.innerHeight,
    width: document.body.clientWidth,
  });

  useEffect(() => {
    const onResize = () => updateSize(setSize, dispatch);
    // Listen for changes to screen size and orientation
    // (this would have been so much easier if Safari would support window.screen.orientation)
    window.visualViewport.addEventListener("resize", onResize);
    if (window?.screen?.orientation) {
      window.screen.orientation?.addEventListener("change", onResize);
    }
    return () => {
      window.visualViewport.removeEventListener("resize", onResize);
      if (window?.screen?.orientation) {
        window.screen.orientation.removeEventListener("change", onResize);
      }
    };
  });

  useEffect(() => {
    // listening for orientation and size changes doesn't always work and on some devices
    // size isn't properly set on mount. Therefore also just check the size repeatedly
    // (which should not be costly)
    const interval = setInterval(() => updateSize(setSize, dispatch), 1000);
    return () => clearInterval(interval);
  }, [setSize, dispatch]);

  return size;
}

function updateSize(setSize: SetState<WindowSize>, dispatch) {
  // use window.innerHeight for height, because vh on mobile is weird (can include the address bar)
  // use document.documentElement.clientwidth for width, to exclude the scrollbar
  const height = window.innerHeight;
  const width = document.body.clientWidth;
  dispatch(setSmallScreen(width < smallScreenSize));
  setSize((size: WindowSize) => {
    if (size.height === height && size.width === width) return size;
    return { height, width };
  });
}
