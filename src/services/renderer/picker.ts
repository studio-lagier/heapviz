import { colorToHex } from './colors';
import { hitCircleMap, canvasState } from '../canvasCache';
import { intersects } from './node-circle';

const colorBuff = new Uint8Array(4);

function isMatch(color: Uint8Array | Uint8ClampedArray, x: number, y: number, cacheKey: string) {
    let node = hitCircleMap[cacheKey][colorToHex(color, true)];
    if (node) return intersects(node, x, y) && node;
}

function getCircleFromColor(color: Uint8Array | Uint8ClampedArray, x: number, y: number, cacheKey: string) {
    //First test the retrieved value
    let match = isMatch(color, x, y, cacheKey);
    if (match) return match;

    //If it fails, fuzz around the value by 1 pt
    for (let i = 0; i < 3; i++) {
        color[i]--;
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let match = isMatch(color, x, y, cacheKey);
            if (match) return match;
            color[j]++;
        }
    }
}

function _pickCircle(x: number, y: number, cacheKey: string) {
    const { hitCanvas: { gl } } = canvasState;
    gl.readPixels(x, gl.drawingBufferHeight - y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, colorBuff);
    return getCircleFromColor(colorBuff, x, y, cacheKey);
}

function _pickCircleCached(x: number, y: number, cacheKey: string) {
    const { cachedHitCanvas: {ctx} } = canvasState;
    const { data: colorBuff } = ctx.getImageData(x, y, 1, 1);
    return getCircleFromColor(colorBuff.slice(0, 3), x, y, cacheKey);
}

export function pickCircle(x: number, y: number, cached: boolean, cacheKey: string) {
    return cached ?
        _pickCircleCached(x, y, cacheKey) :
        _pickCircle(x, y, cacheKey);
}