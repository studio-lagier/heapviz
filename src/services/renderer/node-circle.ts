import * as PIXI from 'pixi.js';
import { Node } from '../worker/heap-profile-parser';
import { circle, GLState, Circle } from './circle';
import { color, hexToColor, padHex } from './colors';

function createNodeColor(t: string, a: number) {
    return color(t).concat(a);
}

function createHitColor(i: number) {
    const base = i.toString(16);
    return padHex(base);
}

export function createHitCircle(node: Node, state: GLState) {
    const { r, x, y, i } = node;
    const hitColor = createHitColor(i);
    const color = hexToColor(hitColor).concat(1);
    const hitCircle = createCircle(r, x, y, color, state);
    return { hitColor, hitCircle };
}

export function createSizeCircles(node: Node, state: GLState) {
    const { r, x, y, t, s, v } = node;
    const retainedSize = createCircle(r, x, y, createNodeColor(t, 0.6), state);
    const sizes = [retainedSize];

    const ss = r * s / v;

    if (ss) {
        const selfSize = createCircle(ss, x, y, createNodeColor(t, 0.8), state);
        sizes.push(selfSize);
    }

    return sizes;
}

export function createCircle(size: number, x: number, y: number, c: number[], state: GLState) {
    const sprite = circle(size, 32, c, state);
    sprite.t = [x,y,0];
    return sprite;
}

export function createDropShadow(node: Node, state: GLState) {
    const { r, x, y } = node;
    return createCircle(r + 8, x, y, [0, 0, 0, 0.6], state);
}

export function createHighlights(node: Node, state: GLState) {
    const [retainedSize, selfSize] = createSizeCircles(node, state);
    retainedSize.c[3] = 0.8;

    const highlights = [retainedSize];

    if (selfSize) {
        selfSize.c[3] = 1;
        highlights.push(selfSize);
    }

    return highlights;
}

export function createOutline(node: Node, state: GLState) {
    const { r, x, y } = node;
    return createCircle(r + 4, x, y, [255, 0, 0, 0.8], state);
}

export function intersects(node: Node, x: number, y: number) {
    const dx = Math.abs(x - node.x);
    const dy = Math.abs(y - node.y);
    const r = node.r;

    if (dx > r || dy > r) return false;
    if (dx + dy <= r) return true;
    if (dx * dx + dy * dy <= r * r) return true;
}