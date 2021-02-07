import { generateCoordMap } from "./utils";

let socket = new WebSocket("ws://localhost:3030");
socket.onopen = function (e) {
  generateCoordMap(window.location.pathname, socket);
};

socket.addEventListener("message", function (event) {
  const image: HTMLImageElement | null = document.querySelector("#img");
  if (image) {
    image.src = event.data;
  }
});
