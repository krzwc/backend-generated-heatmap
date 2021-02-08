import type { IDimensions, ICoordMap } from './types';
import { createCanvas } from 'canvas';

const gradientColors = {
  0.4: 'blue',
  0.5: 'cyan',
  0.6: 'lime',
  0.8: 'yellow',
  1.0: 'red',
};

const levels = 256;

export const generateHeatMap = (
  /* dest?: string | HTMLElement,
  dimensions?: IDimensions,
  mapIds: string[] = ['default'],
  screenSize?: string, */
  coordMap: ICoordMap,
  ws: WebSocket,
) => {
  /*  let id: string = `_coordMap_${mapIds[0]}`;
  if (!(id in window)) {
    return false;
  }
  if (!screenSize) {
    screenSize = getScreenSize(false);
  }
  let coordMap: ICoordMap = window[id];
  if (!coordMap[screenSize]) {
    return false;
  }

  let canvas: HTMLCanvasElement = document.createElement('canvas');
  let [sw, sh]: number[] = getScreenSize()
    .split('x')
    .map((sz: string) => Number(sz)); */
  const pathnames = Object.keys(coordMap);
  const canvasSizes = pathnames.flatMap((pathname) =>
    Object.keys(coordMap[pathname]).map((WxH) => ({
      pathname,
      WxH,
      xySize: WxH.split('x').map((sz) => Number(sz)),
    })),
  );

  //   console.log(canvasSizes);

  /* 
  For the time being I am only using first indexed pathname 
  and its highest recorded dimensions
  */

  const mapId = '/';
  const mapIds = [mapId];
  const screenSize = canvasSizes[0].WxH;
  const [sw, sh] = canvasSizes[0].xySize;
  const dimensions: IDimensions = {};

  if (dimensions && (dimensions.maxWidth || dimensions.maxHeight)) {
    const sr: number = sw / sh;
    const srr: number = sh / sw;
    if (!dimensions.maxWidth) {
      dimensions.maxWidth = 0;
    }
    if (!dimensions.maxHeight) {
      dimensions.maxHeight = 0;
    }
    let smallestDimension =
      dimensions.maxWidth > dimensions.maxHeight
        ? dimensions.maxHeight
        : dimensions.maxWidth;
    if (sr === 1) {
      dimensions.width = smallestDimension;
      dimensions.height = smallestDimension;
    } else if (sr > 1 && dimensions.maxWidth) {
      dimensions.width = dimensions.maxWidth;
      dimensions.height = dimensions.maxWidth * srr;
    } else if (dimensions.maxHeight) {
      dimensions.height = dimensions.maxHeight;
      dimensions.width = dimensions.maxHeight * sr;
    } else {
      dimensions.width = dimensions.maxWidth;
      dimensions.height = dimensions.maxWidth * srr;
    }
  }

  const canvas = createCanvas(
    dimensions.width || sw,
    dimensions.height || sh,
  );

  // creating a grayscale blurred circle image that will be used for drawing points
  const ctx = canvas.getContext('2d');
  let wr: number, hr: number;

  wr = (dimensions.width || sw) / sw;
  hr = (dimensions.height || sh) / sh;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const coordsTotal = coordMap[mapId][screenSize].length;
  // ctx.filter = 'blur(5px)';
  const alpha = 0.1 / mapIds.length;
  mapIds.forEach((mapId: string) => {
    // id = `_coordMap_${mapId}`;
    // coordMap = window[id];
    for (let i = 0; i < coordsTotal; i++) {
      let [x, y] = coordMap[mapId][screenSize][i];
      if (dimensions) {
        x = x * wr;
        y = y * hr;
      }
      ctx.fillStyle = `rgb(0, 0, 0, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fill();
    }
  });

  // Adding gradient
  // creating a 256x1 gradient that will be used to turn a grayscale heatmap into a colored one
  const gradientCanvas = createCanvas(1, levels);
  const gradientCtx = gradientCanvas.getContext('2d');
  const gradient = gradientCtx.createLinearGradient(0, 0, 0, levels);
  Object.entries(gradientColors).forEach(([k, v]) => {
    gradient.addColorStop(Number(k), v);
  });

  gradientCtx.fillStyle = gradient;
  gradientCtx.fillRect(0, 0, 1, levels);

  const gradientPixels = gradientCtx.getImageData(0, 0, 1, levels)
    .data;

  // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
  const imageData = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height,
  );
  const pixels = imageData.data;
  let len = pixels.length / 4;

  while (len--) {
    let idx = len * 4 + 3;
    const alpha = pixels[idx] / 256;

    const colorOffset = Math.floor(alpha * 255);
    pixels[idx - 3] = gradientPixels[colorOffset * 4];
    pixels[idx - 2] = gradientPixels[colorOffset * 4 + 1];
    pixels[idx - 1] = gradientPixels[colorOffset * 4 + 2];
  }

  ctx.putImageData(imageData, 0, 0);
  const output = canvas.toDataURL('image/png');
  ws.send(output);
};
