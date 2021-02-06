export type ICoordMap = {
  [pathname: string]: Record<string, number[][]>;
};

export type IMsg = {
  mapId: string;
  screenSize: string;
  xy: [number, number];
};
