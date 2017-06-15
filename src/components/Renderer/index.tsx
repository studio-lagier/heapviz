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

    componentWillUnmount() {
        destroyRenderer();
    }

    //Make this better - create renderer during app init and on
    // width/height change. When new renderer is created, flip
    // dirty flag to re-append
    render() {
        const { width, height } = this.props;
        return (
            <div className="Renderer">
                <canvas width={width} height={height} ref={
                    canvas => createRenderer(canvas)
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
