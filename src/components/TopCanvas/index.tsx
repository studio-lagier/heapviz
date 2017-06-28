import * as React from 'react';
import { EventHandler, MouseEvent, Component } from 'react';
import './TopCanvas.pcss';
import { connect } from 'react-redux';
import { createTopCanvasRenderer, destroyRenderer } from '../../services/renderer';

interface TopCanvasProps {
    width: number;
    height: number;
    onMouseMove: Function;
    onClick: Function;
    cached: boolean;
    cacheKey: string;
}

interface TopCanvasState {
    cached: boolean;
    cacheKey: string;
}
export class TopCanvas extends React.Component<TopCanvasProps, TopCanvasState> {

    canvas: HTMLCanvasElement;
    topCanvas: HTMLCanvasElement;

    constructor(props: TopCanvasProps) {
        super(props);
        this.state = {
            cached: props.cached,
            cacheKey: props.cacheKey
        };
    }

    componentWillReceiveProps({ cached, cacheKey }:TopCanvasProps) {
        this.setState({ cached, cacheKey });
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        const { width, height, onMouseMove, onClick, cached } = this.props;
        return (
            <div className="TopCanvas">
                <canvas width={width} height={height} className="topCanvas" onMouseMove={ev => onMouseMove(ev, this.state.cached, this.state.cacheKey) } onClick={ev => onClick(ev, this.state.cached, this.state.cacheKey)} ref={
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