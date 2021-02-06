import { generateCoordMap } from "./utils";
import type { ICoordMap } from "./types";

const coordMap: ICoordMap = {};

let socket = new WebSocket("ws://localhost:3030");
socket.onopen = function (e) {
  generateCoordMap(window.location.pathname, coordMap, socket);
};
