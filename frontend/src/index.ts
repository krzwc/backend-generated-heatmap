import { generateCoordMap } from "./utils";

let socket = new WebSocket("ws://localhost:3030");
socket.onopen = function (e) {
  generateCoordMap(window.location.pathname, socket);
};
