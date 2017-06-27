import * as React from 'react';
import { EventHandler, MouseEvent, Component } from 'react';
import './TopCanvas.pcss';
import { connect } from 'react-redux';
import { createTopCanvasRenderer, destroyRenderer } from '../../services/renderer';

interface TopCanvasProps {
    width: number;
    height: number;
    cached: boolean;
    onMouseMove: Function;
    onClick: Function;
}

export class TopCanvas extends React.Component<TopCanvasProps, {}> {

    canvas: HTMLCanvasElement;
    topCanvas: HTMLCanvasElement;

    shouldComponentUpdate() {
        return false;
    }

    render() {
        const { width, height, onMouseMove, onClick, cached } = this.props;
        return (
            <div className="TopCanvas">
                <canvas width={width} height={height} className="topCanvas" onMouseMove={ev => onMouseMove(ev, cached)} onClick={ev => onClick(ev, cached)} ref={
                    canvas => {
                        this.canvas = canvas;
                        createTopCanvasRenderer(canvas);
                    }
                } />
            </div>
        );
    }
}

export default TopCanvas