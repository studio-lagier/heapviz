import { GLState, Circle, dispose } from './circle';
import NodeCircle from './node-circle';
import { Node } from '../worker/heap-profile-parser';

interface HitCircleMap {
    [key:string] : NodeCircle
}

export var circles: Circle[] = [];
export var hitCircles: Circle[] = [];
export var canvasState: GLState;
export var hitCanvasState: GLState;
export var hitCircleMap:HitCircleMap = {};

export function clearState() {
    circles = [];
    hitCircles = [];
    hitCircleMap = {};
    dispose(canvasState);
    dispose(hitCanvasState);
}

export function setState(state: GLState, hit:boolean=false) {
    hit ?
        hitCanvasState = state :
        canvasState = state;
}