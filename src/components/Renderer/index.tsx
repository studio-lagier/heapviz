import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { Component } from 'react';
import './Renderer.pcss';
import store from '../../store';
import { connect } from 'react-redux';
import {createRenderer, createTopCanvasRenderer, destroyRenderer} from '../../services/renderer';

interface RendererProps {
    width: number;
    height: number;
    canvasDirty: boolean;
}

export class Renderer extends React.Component<RendererProps, {}> {

    canvas: HTMLCanvasElement;
    topCanvas: HTMLCanvasElement;

    componentWillUnmount() {
        destroyRenderer(this.topCanvas);
    }

    //Make this better - create renderer during app init and on
    // width/height change. When new renderer is created, flip
    // dirty flag to re-append
    render() {
        const { width, height } = this.props;
        return (
            <div className="Renderer" style={{ width, height }}>
                <canvas width={2*width} height={2*height} ref={
                    canvas => {
                        this.canvas = canvas;
                        createRenderer(canvas);
                    }
                } />
                <canvas width={2*width} height={2*height} className="topCanvas" ref={
                    canvas => {
                        this.topCanvas = canvas;
                        createTopCanvasRenderer(canvas);
                    }
                } />
            </div>
        );
    }
}

export default connect(
  ({ renderer: { width, height, canvasDirty } }) => {
      return { width, height, canvasDirty };
  }
)(Renderer);
