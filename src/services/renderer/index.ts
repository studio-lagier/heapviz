import * as PIXI from 'pixi.js';
import { Observable, Subscriber } from 'rxjs';
import { FSA } from '../../../typings/fsa';
import { actions } from './state';
import { Node } from '../worker/heap-profile-parser';
import NodeCircle from './node-circle';
import { generateTextures, texture } from './textures';

const stage = new PIXI.Container();
(<any>window).stage = stage;

export function createRenderer(width: number, height: number, o = {}) {
    const options = Object.assign({
        resolution: 2,
        transparent: true,
        antialias: true
    }, o);

    const newRenderer = PIXI.autoDetectRenderer(width, height, options);
    newRenderer.render(stage);
    return newRenderer;
}

const renderer = createRenderer(1024, 1024);
(<any>window).renderer = renderer;

function _drawNodes(start: number, nodes: Node[], sub: Subscriber<{}>) {
    let currentNode = start;
    let timeDiff = 0;
    const startTime = Date.now();
    while (currentNode < nodes.length && timeDiff < 10) {
        const node = nodes[currentNode];
        const circle = new NodeCircle({ node, texture: texture(node.t) });

        stage.addChild(circle.retainedSize);

        if (circle.selfSize) {
            stage.addChild(circle.selfSize);
        }

        currentNode++;
        timeDiff = Date.now() - startTime;
    }

    if (currentNode < nodes.length) {
        sub.next(currentNode);
        requestAnimationFrame(_drawNodes.bind(null, currentNode, nodes, sub));
    } else {
        renderer.render(stage);
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
    generateTextures( nodeTypes, renderer );
}

export default renderer;