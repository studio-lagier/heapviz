import * as React from 'react';
import { EventHandler, MouseEvent, Component } from 'react';
import './Renderer.pcss';
import store from '../../store';
import { connect } from 'react-redux';
import { destroyRenderer, mousemove, click } from '../../services/renderer';
import { actions } from '../../services/heap/state';
import TopCanvas from '../TopCanvas';
import DrawCanvas from '../DrawCanvas';

const { heap: { pickNode, fetchNode } } = actions;

interface RendererProps {
    width: number;
    height: number;
    cached: boolean;
    onMouseMove: EventHandler<MouseEvent<HTMLCanvasElement>>;
    onClick: EventHandler<MouseEvent<HTMLCanvasElement>>;
}

export class Renderer extends React.Component<RendererProps, {}> {

    canvas: HTMLCanvasElement;
    topCanvas: HTMLCanvasElement;

    componentWillUnmount() {
        destroyRenderer();
    }

    //Fix this on width/height change
    render() {
        const { width, height, onMouseMove, onClick, cached } = this.props;
        return (
            <div className="Renderer" style={{ width, height }}>
                <DrawCanvas width={2 * width} height={2 * height} cached={cached}/>
                <TopCanvas width={2 * width} height={2 * height} onMouseMove={onMouseMove} onClick={onClick} cached={cached} />
            </div>
        );
    }
}

export default connect(
  ({ renderer: { width, height } }) => {
      return { width, height };
    },
  dispatch => {
      return {
          onMouseMove: (ev, cached) => mousemove(ev, cached, node => dispatch(pickNode(node))),
          onClick: (ev, cached) => click(ev, cached, node => dispatch(fetchNode(node.d)))
      }
  }
)(Renderer);
