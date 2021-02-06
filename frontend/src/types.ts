interface IDimensions {
  width?: number;
  height?: number;
  maxWidth?: number;
  maxHeight?: number;
}
interface IPoint {
  x: number;
  y: number;
}

export type ICoordMap = {
  [pathname: string]: Record<string, number[][]>;
};
