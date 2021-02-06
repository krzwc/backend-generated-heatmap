/**
 * Gets the current viewport size within your browser.
 */
export const getScreenSize = (trueSize: boolean = true): string => {
  if (document.documentElement && trueSize) {
    return (
      document.documentElement.clientWidth.toString() +
      "x" +
      document.documentElement.clientHeight.toString()
    );
  } else {
    return window.innerWidth.toString() + "x" + window.innerHeight.toString();
  }
};

const coordMap = {};

/**
 * Generates data for the heatmap based on the mouse movements.
 */
const generateCoordMap = (mapId: string = "default") => {
  let screenSize: string = getScreenSize();

  coordMap[id] = {};
  window.addEventListener("resize", () => (screenSize = getScreenSize(false)));
  let hoverTimer: NodeJS.Timeout,
    hoverTime: number = 0;
  document.addEventListener("mousemove", (event) => {
    clearInterval(hoverTimer);
    if (!(screenSize in coordMap)) {
      coordMap[id][screenSize] = [];
    }
    let x: number = event.clientX + window.scrollX,
      y: number = event.clientY + window.scrollY;
    coordMap[id][screenSize].push([x, y]);
    hoverTimer = setInterval(() => {
      coordMap[id][screenSize].push([x, y]);
      hoverTime++;
      if (hoverTime > 5) {
        clearInterval(hoverTimer);
      }
    }, 1000);
  });
};
