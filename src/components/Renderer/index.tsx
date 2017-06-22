import * as React from 'react';
import { EventHandler, MouseEvent, Component } from 'react';
import { findDOMNode } from 'react-dom';
import './Renderer.pcss';
import store from '../../store';
import { connect } from 'react-redux';
import { createRenderer, createTopCanvasRenderer, destroyRenderer, mousemove, click } from '../../services/renderer';
import { actions } from '../../services/heap/state';

const { heap: { pickNode, fetchNode } } = actions;

interface RendererProps {
    width: number;
    height: number;
    canvasDirty: boolean;
    onMouseMove: EventHandler<MouseEvent<HTMLCanvasElement>>;
    onClick: EventHandler<MouseEvent<HTMLCanvasElement>>;
}

export class Renderer extends React.Component<RendererProps, {}> {

    canvas: HTMLCanvasElement;
    topCanvas: HTMLCanvasElement;

    componentWillUnmount() {
        destroyRenderer(this.topCanvas);
    }

    //Fix this on width/height change
    render() {
        const { width, height, onMouseMove, onClick } = this.props;
        return (
            <div className="Renderer" style={{ width, height }}>
                <canvas width={2*width} height={2*height} ref={
                    canvas => {
                        this.canvas = canvas;
                        createRenderer(canvas);
                    }
                } />
                <canvas width={2 * width} height={2 * height} className="topCanvas" onMouseMove={onMouseMove} onClick={onClick} ref={
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
    },
  dispatch => {
      return {
          onMouseMove: ev => mousemove(ev, node => dispatch(pickNode(node))),
          onClick: ev => click(ev, node => dispatch(fetchNode(node.d)))
      }
  }
)(Renderer);
