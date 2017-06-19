import { Observable, Subscriber } from 'rxjs';
import { FSA } from '../../../typings/fsa';
import { actions } from './state';
import { Node } from '../worker/heap-profile-parser';
import {createSizeCircles, createHitCircle, createHighlights, createOutline, createDropShadow, intersects} from './node-circle';
import { init, update, Circle, GLState } from './circle';
import { pickCircle } from './picker';
import { circles, hitCircles, canvasState, hitCanvasState, topCanvasState, hitCircleMap, setState, clearState } from './shared';
import {MouseEvent} from 'react';

let outline: Circle[];

export const mousemove = (ev: MouseEvent<HTMLCanvasElement>) => {
    ifNodeExists(ev, node => {
        updateTopCanvas(node);
    });
}

export const click = (ev: MouseEvent<HTMLCanvasElement>) => {
    ifNodeExists(ev, node => {
        updateTopCanvas(node, true);
    });
}

function ifNodeExists(ev: MouseEvent<HTMLCanvasElement>, callback: (node:Node) => void) {
    const { offsetX, offsetY } = ev.nativeEvent;
    const node = pickCircle(offsetX, offsetY);
    node && callback(node);
}

//Updates our currently interacted nodes by creating a stack of:
// shadow, outline(optional), retainedSize, selfSize(optional)
function updateTopCanvas(node: Node, newOutline:boolean=false) {
    const shadow = createDropShadow(node, topCanvasState);
    const highlights = createHighlights(node, topCanvasState);

    if (newOutline) outline = [createOutline(node, topCanvasState), ...highlights];

    const circ = [];

    if (outline) circ.push(...outline);
    if (!newOutline) circ.push(...highlights);
    circ.unshift(shadow);

    update(circ, topCanvasState);
}

export function destroyRenderer(canvas:HTMLCanvasElement) {
    clearState();
}

export function createRenderer(canvas: HTMLCanvasElement) {
    if (!canvas) return;

    const hitCanvas = <HTMLCanvasElement>canvas.cloneNode();

    setState(
        init(canvas, [255, 255, 255]), 'canvas'
    );

    setState(
        init(hitCanvas, [255, 255, 255], { antialias: false }), 'hitcanvas'
    );
}

export function createTopCanvasRenderer(canvas: HTMLCanvasElement) {
    if (!canvas) return;
    setState(
        init(canvas, [0,0,0,0], {alpha: true}), 'topcanvas'
    );
}

function _drawNodes(start: number, nodes: Node[], sub: Subscriber<{}>) {
    let currentNode = start;
    let timeDiff = 0;
    const startTime = Date.now();
    while (currentNode < nodes.length && timeDiff < 10) {
        const node = nodes[currentNode];
        circles.push(...createSizeCircles(node, canvasState));
        const { hitColor, hitCircle } = createHitCircle(node, hitCanvasState);
        hitCircles.push(hitCircle);
        hitCircleMap[hitColor] = node;

        currentNode++;
        timeDiff = Date.now() - startTime;
    }

    if (currentNode < nodes.length) {
        sub.next(currentNode);
        requestAnimationFrame(_drawNodes.bind(null, currentNode, nodes, sub));
    } else {
        update(circles, canvasState);
        update(hitCircles, hitCanvasState);
        sub.complete();
    }
}

export function drawNodes(nodes: Node[]) {
    const { renderer: { renderComplete, renderBatch } } = actions;
    return new Observable(sub => {
        _drawNodes(0, nodes, sub);
    });
}