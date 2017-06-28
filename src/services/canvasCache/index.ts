import { GLState, TwoDState, Circle, dispose } from '../renderer/canvas';
import { Node } from '../worker/heap-profile-parser';
import { FilterState } from '../filters/state';
import { SamplesState } from '../samples/state';

interface HitCircleMap {
    [key: string]: {
        [key: string]: Node;
    }
}

export var circles: Circle[] = [];
export var hitCircles: Circle[] = [];
export var hitCircleMap: HitCircleMap = {};


interface CanvasState {
    drawCanvas?: GLState;
    hitCanvas?: GLState;
    topCanvas?: GLState;
    cachedDrawCanvas?: TwoDState;
    cachedHitCanvas?: TwoDState;
}

export let canvasState: CanvasState = {}

export function clearState() {
    clearCanvas();
    dispose(canvasState.drawCanvas);
    dispose(canvasState.hitCanvas);
    dispose(canvasState.topCanvas);
    canvasState.cachedDrawCanvas.canvas.remove();
    canvasState.cachedHitCanvas.canvas.remove();
}

export function clearCanvas() {
    circles = [];
    hitCircles = [];
}

interface SetupPayload {
    drawCanvas: GLState;
    hitCanvas: GLState;
    cachedDrawCanvas: TwoDState;
    cachedHitCanvas: TwoDState;
}

export function setupCanvasState(setupPayload: SetupPayload) {
    Object.assign(canvasState, setupPayload)
}

interface CanvasCacheNode {
    draw: ImageBitmap;
    hit: ImageBitmap;
}

interface CanvasCache {
    [key: string] : CanvasCacheNode
}

export interface ToCacheKeyPayload {
    filters: FilterState,
    samples: SamplesState
}
export function toCacheKey({ filters, samples }: ToCacheKeyPayload) {
    return `${JSON.stringify(filters)}|${JSON.stringify(samples)}`;
}

function fromCacheKey(key: string) {
    const tokens = key.split('|');
    return {
        filters: JSON.parse(tokens[0]),
        samples: JSON.parse(tokens[1])
    }
}

const canvasCache: CanvasCache = {};
export function cacheCanvases(draw: HTMLCanvasElement, hit: HTMLCanvasElement, key: string) {
    return Promise.all([
        createImageBitmap(draw),
        createImageBitmap(hit)
    ]).then(([draw, hit]) => {
        canvasCache[key] = { draw, hit}
    });
}

export function getCanvases(key: string) {
    return canvasCache[key];
}