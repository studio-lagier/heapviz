import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { Component } from 'react';
import './Renderer.pcss';
import store from '../../store';
import { connect } from 'react-redux';
import {createRenderer, destroyRenderer} from '../../services/renderer';

interface RendererProps {
    width: number;
    height: number;
    canvasDirty: boolean;
}

export class Renderer extends React.Component<RendererProps, {}> {

    canvas: HTMLCanvasElement;

    componentWillUnmount() {
        destroyRenderer(this.canvas);
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
                        createRenderer(canvas);
                        this.canvas = canvas;
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
