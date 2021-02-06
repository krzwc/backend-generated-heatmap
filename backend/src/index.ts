import * as WebSocket from 'ws';
import type { ICoordMap, IMsg } from './types';

const wss = new WebSocket.Server({ port: 3030 });
const coordMap: ICoordMap = {};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const { mapId, screenSize, xy }: IMsg = JSON.parse(
      String(message),
    );
    if (!(mapId in coordMap)) {
      coordMap[mapId] = {};
    }
    if (!(screenSize in coordMap[mapId])) {
      coordMap[mapId][screenSize] = [];
    }
    coordMap[mapId][screenSize].push(xy);
    console.log(JSON.stringify(coordMap));
  });
});
