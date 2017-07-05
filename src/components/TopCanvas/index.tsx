import * as React from 'react';
import { EventHandler, MouseEvent, Component } from 'react';
import './TopCanvas.pcss';
import { connect } from 'react-redux';
import { createTopCanvasRenderer, destroyRenderer } from '../../services/renderer';

interface TopCanvasProps {
    size: number;
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

    constructor(props: TopCanvasProps) {
        super(props);
        this.state = {
            cached: props.cached,
            cacheKey: props.cacheKey
        };
    }

    componentWillReceiveProps(props: TopCanvasProps) {
        const { cached, cacheKey, size } = props;
        this.setState({ cached, cacheKey });
        this.canvas.width = size;
        this.canvas.height = size;
        createTopCanvasRenderer(this.canvas);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        const { onMouseMove, onClick, cached, size } = this.props;
        return (
            <div className="TopCanvas">
                <canvas width={size} height={size} className="topCanvas" onMouseMove={ev => onMouseMove(ev, this.state.cached, this.state.cacheKey) } onClick={ev => onClick(ev, this.state.cached, this.state.cacheKey)} ref={
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