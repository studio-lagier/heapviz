import * as PIXI from 'pixi.js';
import { Observable, Subscriber } from 'rxjs';
import { FSA } from '../../../typings/fsa';
import { actions } from './state';
import { Node } from '../worker/heap-profile-parser';
import NodeCircle from './node-circle';
import { init, update, GLState } from './circle';
import { pickCircle } from './picker';
import { circles, hitCircles, canvasState, hitCanvasState, hitCircleMap, setState, clearState } from './shared';

let listener: any;

export function destroyRenderer(canvas:HTMLCanvasElement) {
    clearState();
    canvas.removeEventListener('mousemove', listener);
}

export function createRenderer(canvas: HTMLCanvasElement) {
    if (canvas) {
        const hitCanvas = <HTMLCanvasElement>canvas.cloneNode();

        setState(
            init(canvas, [255, 255, 255])
        );

        setState(
            init(hitCanvas, [255, 255, 255], { antialias: false })
        , true);

        listener = (ev:MouseEvent) => {
            const node = pickCircle(ev.offsetX, ev.offsetY);
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