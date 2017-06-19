import { GLState, Circle, dispose } from './circle';
import { Node } from '../worker/heap-profile-parser';

interface HitCircleMap {
    [key:string] : Node
}

export var circles: Circle[] = [];
export var hitCircles: Circle[] = [];
export var canvasState: GLState;
export var hitCanvasState: GLState;
export var topCanvasState: GLState;
export var hitCircleMap:HitCircleMap = {};

export function clearState() {
    circles = [];
    hitCircles = [];
    hitCircleMap = {};
    dispose(canvasState);
    dispose(hitCanvasState);
    dispose(topCanvasState);
}

export function setState(state: GLState, target:string) {
    switch (target) {
        case 'canvas':
            return canvasState = state;
        case 'hitcanvas':
            return hitCanvasState = state;
        case 'topcanvas':
            return topCanvasState = state;
    }
}