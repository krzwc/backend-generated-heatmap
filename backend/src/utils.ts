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
    let sr: number = sw / sh;
    let srr: number = sh / sw;
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

  let ctx: CanvasRenderingContext2D = canvas.getContext('2d'),
    wr: number,
    hr: number;

  wr = dimensions.width || sw / sw;
  hr = dimensions.height || sh / sh;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const coordsTotal: number = coordMap[mapId][screenSize].length;
  ctx.filter = 'blur(5px)';
  const alpha: number = 0.1 / mapIds.length;
  mapIds.forEach((mapId: string) => {
    // id = `_coordMap_${mapId}`;
    // coordMap = window[id];
    for (let i = 0; i < coordsTotal; i++) {
      let [x, y]: number[] = coordMap[mapId][screenSize][i];
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

  const gradientCanvas = createCanvas(1, levels);
  const gradientCtx = gradientCanvas.getContext('2d');
  const gradient = gradientCtx.createLinearGradient(0, 0, 0, levels);
  Object.entries(gradientColors).forEach(([k, v]) =>
    gradient.addColorStop(Number(k), v),
  );

  gradientCtx.fillStyle = gradient;
  gradientCtx.fillRect(0, 0, 1, levels);

  let gradientPixels = gradientCtx.getImageData(0, 0, 1, levels).data;
  let imageData: any = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height,
  );
  let pixels: any = imageData.data;
  let len: number = pixels.length / 4;

  while (len--) {
    let idx: number = len * 4 + 3;
    let alpha: number = pixels[idx] / 256;

    let colorOffset: number = Math.floor(alpha * 255);
    pixels[idx - 3] = gradientPixels[colorOffset * 4];
    pixels[idx - 2] = gradientPixels[colorOffset * 4 + 1];
    pixels[idx - 1] = gradientPixels[colorOffset * 4 + 2];
  }

  ctx.putImageData(imageData, 0, 0);
  const output: string = canvas.toDataURL('image/png');
  ws.send(output);
  /* const output: string = canvas.toDataURL('image/png');
  if (dest) {
    let destElement: HTMLElement;
    if (typeof dest === 'string') {
      destElement =
        ~dest.indexOf('#') || ~dest.indexOf('.')
          ? document.querySelector(dest)
          : document.getElementById(`${dest}`);
    } else {
      destElement = dest;
    }
    if (destElement) {
      destElement.innerHTML = `<img src="${output}" />`;
    }
  }
  return output; */
};
