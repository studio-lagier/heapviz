import { colorToHex } from './colors';
import { hitCircleMap, canvasState } from '../canvasCache';
import { intersects } from './node-circle';

const colorBuff = new Uint8Array(3);

function isMatch(color: Uint8Array | Uint8ClampedArray, x: number, y: number) {
    let node = hitCircleMap[colorToHex(color)];
    if(node) return intersects(node, x, y) && node;
}

function getCircleFromColor(color: Uint8Array | Uint8ClampedArray, x: number, y: number) {
    //First test the retrieved value
    let match = isMatch(color, x, y);
    if (match) return match;

    //If it fails, fuzz around the value by 1 pt
    for (let i = 0; i < 3; i++) {
        color[i]--;
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let match = isMatch(color, x, y);
            if (match) return match;
            color[j]++;
        }
    }
}

function _pickCircle(x: number, y: number) {
    const { hitCanvas: { gl } } = canvasState;
    const color = gl.readPixels(x, gl.drawingBufferHeight - y, 1, 1, gl.RGB, gl.UNSIGNED_BYTE, colorBuff);
    return getCircleFromColor(colorBuff, x, y);
}

function _pickCircleCached(x: number, y: number) {
    const { cachedHitCanvas: {ctx} } = canvasState;
    const { data: colorBuff } = ctx.getImageData(x, y, 1, 1);
    return getCircleFromColor(colorBuff, x, y);
}

export function pickCircle(x: number, y: number, cached: boolean) {
    return cached ?
        _pickCircleCached(x, y) :
        _pickCircle(x, y);
}