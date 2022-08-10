import { useEffect } from "react";

// based on https://stackoverflow.com/a/56663695

export default function useSwipe(onswipe: (direction: string) => void, distance: number = 110) {
  useEffect(() => {
    let touchstartX = 0;
    let touchendX = 0;
    let touchstartY = 0;
    let touchendY = 0;

    function touchstart(e) {
      touchstartX = e.changedTouches[0].screenX;
      touchstartY = e.changedTouches[0].screenY;
    }

    function checkDirection() {
      if (touchstartX - touchendX > distance) onswipe("left");
      if (touchendX - touchstartX > distance) onswipe("right");
      if (touchstartY - touchendY > distance) onswipe("up");
      if (touchendY - touchstartY > distance) onswipe("down");
    }

    function touchend(e) {
      touchendX = e.changedTouches[0].screenX;
      touchendY = e.changedTouches[0].screenY;
      checkDirection();
    }

    document.addEventListener("touchstart", touchstart);
    document.addEventListener("touchend", touchend);

    return () => {
      document.removeEventListener("touchstart", touchstart);
      document.removeEventListener("touchend", touchend);
    };
  }, [onswipe, distance]);

  return null;
}
