import * as React from 'react';
import { EventHandler, MouseEvent, Component } from 'react';
import './DrawCanvas.pcss';
import { connect } from 'react-redux';
import { createCanvases, destroyRenderer } from '../../services/renderer';

interface DrawCanvasProps {
    width: number;
    height: number;
    cached: boolean;
}

export class DrawCanvas extends React.Component<DrawCanvasProps, {}> {

    drawCanvas: HTMLCanvasElement;
    cachedDrawCanvas: HTMLCanvasElement;
    mountPoint: HTMLDivElement;

    constructor(props:DrawCanvasProps) {
        super(props);
        const { width, height } = props;
        const { drawCanvas, cachedDrawCanvas } = createCanvases(width, height);
        this.drawCanvas = drawCanvas.gl.canvas;
        this.cachedDrawCanvas = cachedDrawCanvas.canvas;
    }

    componentWillReceiveProps({ cached }: DrawCanvasProps) {
        if (cached === this.props.cached) return;
        if (cached) {
            this.mountPoint.removeChild(this.drawCanvas);
            this.mountPoint.appendChild(this.cachedDrawCanvas);
        } else {
            this.mountPoint.removeChild(this.cachedDrawCanvas);
            this.mountPoint.appendChild(this.drawCanvas);
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <div className="DrawCanvas" ref={mountPoint => {
                if (!mountPoint) return;
                this.mountPoint = mountPoint;
                mountPoint.appendChild(this.drawCanvas);
            }}/>
        );
    }
}

export default DrawCanvas;