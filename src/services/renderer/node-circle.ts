import * as PIXI from 'pixi.js';
import { textures } from './textures';
import { Node } from '../worker/heap-profile-parser';
// import EventEmitter from 'events';

interface NodeCircleProps {
    node: Node;
    texture: PIXI.Texture
}
export default class NodeCircle {
    node: Node;
    texture: PIXI.Texture;
    retainedSize: PIXI.Sprite;
    selfSize: PIXI.Sprite;
    locked = false;
    outline: PIXI.Sprite;
    outlineInner: PIXI.Sprite;

    //TODO: Replace multiple sprites with single updating texture

    constructor({node, texture}: NodeCircleProps) {
        // super();

        this.node = node;
        this.texture = texture;

        const size = node.r * 2;
        this.retainedSize = this.createSprite(size, node.x, node.y);
        this.retainedSize.alpha = 0.6;
        this.retainedSize.interactive = true;

        //Some magic numbers because it's actually the size of the texture that gets scaled by the sprite
        this.retainedSize.hitArea = new PIXI.Circle(0, 0, 512);
        this.retainedSize
            .on('mouseover', () => this.mouseover())
            .on('mouseout', () => this.mouseout())
            .on('mousedown', () => this.mousedown());

        const selfSize = 2 * node.r * node.s / node.v;

        //Need to guard against undrawable circles
        if (selfSize && selfSize > 0.00000000000001) {
            this.selfSize = this.createSprite(selfSize, node.x, node.y);
            this.selfSize.alpha = 0.8;
        } else {
            throw new Error(`Got tiny selfsize: ${selfSize}`);
        }
    }

    createSprite(size: number, x: number, y: number, texture = this.texture) {
        const sprite = new PIXI.Sprite(texture);
        sprite.width = size;
        sprite.height = size;
        sprite.anchor = <PIXI.ObservablePoint>{ x: 0.5, y: 0.5 };
        sprite.position = <PIXI.Point>{ x, y };
        return sprite;
    }

    highlight(active: boolean) {
        this.retainedSize.alpha = active ? 0.8 : 0.6;
        if (this.selfSize) {
            this.selfSize.alpha = active ? 1 : 0.8;
        }
    }

    mouseover() {
        this.highlight(true);
    }

    mouseout() {
        if (!this.locked) {
            this.highlight(false);
        }
    }

    mousedown() {
        // this.emit('mousedown', this.node.d);
    }

    createOutlines() {
        const {node} = this;
        if (!this.outline && !this.outlineInner) {
            this.outline = this.createSprite((node.r + 1) * 2, node.x, node.y, textures['0xF08080']);
            this.outlineInner = this.createSprite(node.r * 2, node.x, node.y, textures['0xFFFFFF']);
        }
    }
}