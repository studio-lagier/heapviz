import { Observable, Subscriber } from 'rxjs';
import { FSA } from '../../../typings/fsa';
import { actions } from './state';
import { Node } from '../worker/heap-profile-parser';
import {createSizeCircles, createHitCircle, createHighlights, createOutline, createDropShadow, intersects} from './node-circle';
import { initWebGL, init2d, update, Circle, GLState } from './canvas';
import { pickCircle } from './picker';
import { circles, hitCircles, hitCircleMap, canvasState, clearState, clearCanvas, cacheCanvases, setupCanvasState, getCanvases } from '../canvasCache';
import { SamplesState } from '../samples/state';
import {MouseEvent} from 'react';

let outline: Circle[];

export const mousemove = (ev: MouseEvent<HTMLCanvasElement>, cached: boolean, cacheKey: string, cb: (p: Node) => FSA) => {
    ifNodeExists(ev, cached, cacheKey, node => {
        updateTopCanvas(node);
        cb(node);
    });
}

export const click = (ev: MouseEvent<HTMLCanvasElement>, cached: boolean, cacheKey: string, cb:(p:Node) => FSA) => {
    ifNodeExists(ev, cached, cacheKey, node => {
        updateTopCanvas(node, true);
        cb(node);
    });
}

function ifNodeExists(ev: MouseEvent<HTMLCanvasElement>, cached: boolean, cacheKey: string, callback: (node:Node) => void) {
    const { offsetX, offsetY } = ev.nativeEvent;
    const node = pickCircle(offsetX, offsetY, cached, cacheKey);
    node && callback(node);
}

//Updates our currently interacted nodes by creating a stack of:
// shadow, outline(optional), retainedSize, selfSize(optional)
function updateTopCanvas(node: Node, newOutline: boolean = false) {
    const { topCanvas } = canvasState;
    const shadow = createDropShadow(node, topCanvas);
    const highlights = createHighlights(node, topCanvas);

    if (newOutline) outline = [createOutline(node, topCanvas), ...highlights];

    const circ = [];

    if (outline) circ.push(...outline);
    if (!newOutline) circ.push(...highlights);
    circ.unshift(shadow);

    update(circ, topCanvas);
}

export function destroyRenderer() {
    clearState();
}

export function createCanvases(size: number) {
    const dc = document.createElement('canvas');
    dc.width = size;
    dc.height = size;

    const cdc = <HTMLCanvasElement>dc.cloneNode();
    const hc = <HTMLCanvasElement>dc.cloneNode();
    const chc = <HTMLCanvasElement>dc.cloneNode();

    const drawCanvas = initWebGL(dc, [255, 255, 255]);
    const hitCanvas = initWebGL(hc, [255, 255, 255], { antialias: false });

    const cachedDrawCanvas = init2d(cdc);
    const cachedHitCanvas = init2d(chc);

    setupCanvasState({
        drawCanvas, hitCanvas, cachedDrawCanvas, cachedHitCanvas
    });

    return { drawCanvas, cachedDrawCanvas };
}

export function createTopCanvasRenderer(canvas: HTMLCanvasElement) {
    if (!canvas) return;
    canvasState.topCanvas = initWebGL(canvas, [0, 0, 0, 0], { alpha: true });
    outline = null;
}

function addNodeToHitCircleMap(node: Node, color: string, cacheKey: string) {
    hitCircleMap[cacheKey] = hitCircleMap[cacheKey] || {};
    hitCircleMap[cacheKey][color] = node;
}

function _drawNodes(start: number, nodes: Node[], sub: Subscriber<{}>, cacheKey: string) {
    const { drawCanvas, hitCanvas } = canvasState;
    let currentNode = start;
    let timeDiff = 0;
    const startTime = Date.now();
    while (currentNode < nodes.length && timeDiff < 10) {
        const node = nodes[currentNode];
        circles.push(...createSizeCircles(node, drawCanvas));
        const { hitColor, hitCircle } = createHitCircle(node, hitCanvas);
        hitCircles.push(hitCircle);
        addNodeToHitCircleMap(node, hitColor, cacheKey);

        currentNode++;
        timeDiff = Date.now() - startTime;
    }

    if (currentNode < nodes.length) {
        sub.next(currentNode);
        requestAnimationFrame(_drawNodes.bind(null, currentNode, nodes, sub, cacheKey));
    } else {
        update(circles, drawCanvas);
        update(hitCircles, hitCanvas);

        //Cache our canvases as ImageBitmaps here so we can reuse them without needing
        // to re-layout
        cacheCanvases(drawCanvas.gl.canvas, hitCanvas.gl.canvas, cacheKey);

        sub.complete();
    }
}

interface DrawNodesPayload {
    nodes: Node[],
    cacheKey: string
}
export function drawNodes({ nodes, cacheKey }:DrawNodesPayload) {
    clearCanvas();
    return new Observable(sub => {
        _drawNodes(0, nodes, sub, cacheKey);
    });
}

export function renderCache(key: string) {
    const { draw, hit } = getCanvases(key);
    const { cachedDrawCanvas, cachedHitCanvas } = canvasState;

    cachedDrawCanvas.ctx.drawImage(draw, 0, 0);
    cachedHitCanvas.ctx.drawImage(hit, 0, 0);

    return new Observable(sub => sub.complete());
}