import * as PIXI from 'pixi.js';
import { Node } from '../worker/heap-profile-parser';
import { circle, GLState, Circle } from './canvas';
import { color, hexToColor, padHex, modifyColor } from './colors';

function createHitColor(i: number, v: number) {
    const base = i.toString(16);
    return padHex(base);
}

export function createHitCircle(node: Node, state: GLState) {
    const { r, x, y, i, v } = node;
    const hitColor = createHitColor(i, v);
    const color = hexToColor(hitColor).concat(1);
    const hitCircle = createCircle(r, x, y, color, state);
    return { hitColor, hitCircle };
}

export function createSizeCircles(node: Node, state: GLState) {
    const { r, x, y, t, s, v } = node;
    const dark = color(t);
    const light = modifyColor(dark, 0.1);
    const retainedSize = createCircle(r, x, y, light, state);
    const sizes = [retainedSize];

    const ss = r * s / v;

    if (ss) {
        const selfSize = createCircle(ss, x, y, dark, state);
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
    const { t } = node;
    const [retainedSize, selfSize] = createSizeCircles(node, state);

    const highlights = [retainedSize];

    if (selfSize) {
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