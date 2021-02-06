import type { ICoordMap } from "./types";

/**
 * Gets the current viewport size within your browser.
 */
const getScreenSize = (trueSize: boolean = true): string => {
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

/**
 * Generates data for the heatmap based on the mouse movements.
 */
export const generateCoordMap = (
  mapId: string = "default",
  coordMap: ICoordMap,
  socket: WebSocket
) => {
  let screenSize: string = getScreenSize();

  coordMap[mapId] = {};
  window.addEventListener("resize", () => (screenSize = getScreenSize(false)));
  let hoverTimer: NodeJS.Timeout,
    hoverTime: number = 0;
  document.addEventListener("mousemove", (event) => {
    clearInterval(hoverTimer);
    if (!(screenSize in coordMap[mapId])) {
      coordMap[mapId][screenSize] = [];
    }
    const x: number = event.clientX + window.scrollX,
      y: number = event.clientY + window.scrollY;
    coordMap[mapId][screenSize].push([x, y]);
    hoverTimer = setInterval(() => {
      coordMap[mapId][screenSize].push([x, y]);
      hoverTime++;
      if (hoverTime > 5) {
        clearInterval(hoverTimer);
      }
    }, 1000);
    // console.log(coordMap);
    socket.send(JSON.stringify(coordMap));
  });
};
