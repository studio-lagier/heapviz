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
}

export class TopCanvas extends React.Component<TopCanvasProps, {cached: boolean}> {

    canvas: HTMLCanvasElement;
    topCanvas: HTMLCanvasElement;

    constructor(props: TopCanvasProps) {
        super(props);
        this.state = { cached: props.cached };
    }

    componentWillReceiveProps({ cached }:TopCanvasProps) {
        this.setState({ cached });
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        const { width, height, onMouseMove, onClick, cached } = this.props;
        return (
            <div className="TopCanvas">
                <canvas width={width} height={height} className="topCanvas" onMouseMove={ev => onMouseMove(ev, this.state.cached) } onClick={ev => onClick(ev, this.state.cached)} ref={
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