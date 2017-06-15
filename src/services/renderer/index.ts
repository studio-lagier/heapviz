import * as PIXI from 'pixi.js';
import { Observable, Subscriber } from 'rxjs';
import { FSA } from '../../../typings/fsa';
import { actions } from './state';
import { Node } from '../worker/heap-profile-parser';
import NodeCircle from './node-circle';
// import { generateTextures, texture } from './textures';
import { init, update, dispose } from './circle';

// const stage = new PIXI.Container();
// (<any>window).stage = stage;
let circles:any = [];

export function destroyRenderer() {
    dispose();
    circles = [];
}

export function createRenderer(canvas: HTMLCanvasElement) {
    if (canvas) {
        init(canvas, [255, 255, 255]);
    }
    // const options = Object.assign({
    //     resolution: 2,
    //     transparent: true,
    //     antialias: true
    // }, o);

    // const newRenderer = PIXI.autoDetectRenderer(width, height, options);
    // newRenderer.render(stage);
    // return newRenderer;
}

// const renderer = createRenderer(1024, 1024);
// (<any>window).renderer = renderer;

function _drawNodes(start: number, nodes: Node[], sub: Subscriber<{}>) {
    let currentNode = start;
    let timeDiff = 0;
    const startTime = Date.now();
    while (currentNode < nodes.length && timeDiff < 10) {
        const node = nodes[currentNode];
        const circle = new NodeCircle(node);

        circles.push(circle.retainedSize);

        if (circle.selfSize) {
            circles.push(circle.selfSize);
        }

        currentNode++;
        timeDiff = Date.now() - startTime;
    }

    if (currentNode < nodes.length) {
        sub.next(currentNode);
        requestAnimationFrame(_drawNodes.bind(null, currentNode, nodes, sub));
    } else {
        update(circles);
        sub.complete();
    }
}

export function drawNodes(nodes: Node[]) {
    const { renderer: { renderComplete, renderBatch } } = actions;
    return new Observable(sub => {
        _drawNodes(0, nodes, sub);
    });
}

export function textures(nodeTypes: string[]) {
    // generateTextures( nodeTypes, renderer );
}

// export default renderer;