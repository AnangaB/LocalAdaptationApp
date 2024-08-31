import { useState, useEffect } from "react";
//below code is from https://www.c-sharpcorner.com/article/how-to-re-render-the-view-when-the-browser-is-resized-in-reactjs/#:~:text=To%20re%2Drender%20a%20React,updating%20the%20component%27s%20state%20accordingly.

/**
 * Custom hook to get the current width and height of the window,
 * and update them when the window is resized.
 *
 * @returns an object containing the current window width and height.
 */
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
};

export default useWindowSize;
