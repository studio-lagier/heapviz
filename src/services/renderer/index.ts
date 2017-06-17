import * as PIXI from 'pixi.js';
import { Observable, Subscriber } from 'rxjs';
import { FSA } from '../../../typings/fsa';
import { actions } from './state';
import { Node } from '../worker/heap-profile-parser';
import NodeCircle from './node-circle';
import { init, update, dispose, glState } from './circle';
import {colorToHex} from './colors';

let circles: any = [];
let hitCircles: any = [];
let canvasState: glState;
let hitCanvasState: glState;
let hitCircleMap: any = {};
let listener: any;
const colorBuff = new Uint8Array(3);

export function destroyRenderer(canvas:HTMLCanvasElement) {
    dispose(canvasState);
    dispose(hitCanvasState);
    circles = [];
    hitCircles = [];
    hitCircleMap = {};
    canvas.removeEventListener('mousemove', listener);
}

function isMatch(color:Uint8Array, x:number, y:number) {
    let candidate = hitCircleMap[colorToHex(color)];
    if (candidate) {
        if (candidate.intersects(x, y)) {
            console.log('found node: ', candidate);
            return candidate;
        }
    }
}

export function getCircleFromColor(color: Uint8Array, x: number, y: number) {
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

    console.log('no match found for ', color);
}

export function pickCircle(x: number, y: number) {
    const {gl} = hitCanvasState;
    const color = gl.readPixels(x, gl.drawingBufferHeight - y, 1, 1, gl.RGB, gl.UNSIGNED_BYTE, colorBuff);
    return getCircleFromColor(colorBuff, x, y);
}

export function createRenderer(canvas: HTMLCanvasElement) {
    if (canvas) {
        const hitCanvas = <HTMLCanvasElement>canvas.cloneNode();
        canvasState = init(canvas, [255, 255, 255]);
        hitCanvasState = init(hitCanvas, [255, 255, 255], {antialias: false});

        listener = (ev:MouseEvent) => {
            pickCircle(ev.offsetX, ev.offsetY);
        }

        canvas.addEventListener('mousemove', listener);
    }
}

function _drawNodes(start: number, nodes: Node[], sub: Subscriber<{}>) {
    let currentNode = start;
    let timeDiff = 0;
    const startTime = Date.now();
    while (currentNode < nodes.length && timeDiff < 10) {
        const node = nodes[currentNode];
        const circle = new NodeCircle(node, canvasState, hitCanvasState);

        circles.push(circle.retainedSize);

        if (circle.selfSize) {
            circles.push(circle.selfSize);
        }

        hitCircles.push(circle.hitCircle);
        hitCircleMap[circle.hitColor] = circle;

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