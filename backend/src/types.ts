export type ICoordMap = {
  [pathname: string]: Record<string, number[][]>;
};

export type IMsg = {
  mapId: string;
  screenSize: string;
  xy: [number, number];
};

export interface IDimensions {
  width?: number;
  height?: number;
  maxWidth?: number;
  maxHeight?: number;
}
export interface IPoint {
  x: number;
  y: number;
}
