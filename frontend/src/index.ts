import { getScreenSize } from "./utils";

let socket = new WebSocket("ws://localhost:3030");
socket.onopen = function (e) {
  socket.send("My name is John");
};

console.log(getScreenSize(true));
console.log(getScreenSize(false));
