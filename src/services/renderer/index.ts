import * as PIXI from 'pixi.js';
import { Observable, Subscriber } from 'rxjs';
import { FSA } from '../../../typings/fsa';
import { actions } from './state';
import { Node } from '../worker/heap-profile-parser';
import {createSizeCircles, createHitCircle, createHighlights, intersects} from './node-circle';
import { init, update, GLState } from './circle';
import { pickCircle } from './picker';
import { circles, hitCircles, canvasState, hitCanvasState, topCanvasState, hitCircleMap, setState, clearState } from './shared';

let listener: any;

export function destroyRenderer(canvas:HTMLCanvasElement) {
    clearState();
    canvas.removeEventListener('mousemove', listener);
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

    listener = (ev:MouseEvent) => {
        const node = pickCircle(ev.offsetX, ev.offsetY);
        if (node) {
            const newHighlights = createHighlights(node, topCanvasState);

            update(newHighlights, topCanvasState);
        }
    }

    canvas.addEventListener('mousemove', listener);
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