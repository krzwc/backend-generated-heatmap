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
  socket: WebSocket
) => {
  let screenSize: string = getScreenSize();

  window.addEventListener("resize", () => (screenSize = getScreenSize(false)));
  let hoverTimer: NodeJS.Timeout,
    hoverTime: number = 0;
  document.addEventListener("mousemove", (event) => {
    clearInterval(hoverTimer);

    const x: number = event.clientX + window.scrollX,
      y: number = event.clientY + window.scrollY;
    hoverTimer = setInterval(() => {
      hoverTime++;
      if (hoverTime > 5) {
        clearInterval(hoverTimer);
      }
    }, 1000);
    socket.send(JSON.stringify({ mapId, screenSize, xy: [x, y] }));
  });
};
