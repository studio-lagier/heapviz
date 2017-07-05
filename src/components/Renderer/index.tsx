import * as React from "react";
import { EventHandler, MouseEvent, Component } from "react";
import "./Renderer.pcss";
import store from "../../store";
import { connect } from "react-redux";
import { destroyRenderer, mousemove, click } from "../../services/renderer";
import { actions } from "../../services/heap/state";
import TopCanvas from "../TopCanvas";
import DrawCanvas from "../DrawCanvas";
import { FSA } from "../../../typings/fsa";
import debounce = require("lodash.debounce");
import { actions as filterActions } from "../../services/filters/state";
import { actions as rendererActions } from "../../services/renderer/state";

const { heap: { pickNode, fetchNode } } = actions;
const { filters: { submitFilters } } = filterActions;
const { renderer: { resizeRenderer } } = rendererActions;

interface RendererProps {
  size: number;
  cached: boolean;
  cacheKey: string;
  filters: any;
  start: number;
  end: number;
  onMouseMove: EventHandler<MouseEvent<HTMLCanvasElement>>;
  onClick: EventHandler<MouseEvent<HTMLCanvasElement>>;
  onResize: (size: number) => FSA;
  initialSize: (size: number) => FSA;
}

export class Renderer extends React.Component<RendererProps, {}> {
  container: HTMLDivElement;
  listener: EventListener;

  componentDidMount() {
    const { getSize, container } = this;
    const debouncedResize = debounce(() => {
      this.props.onResize(getSize(container));
    }, 200, { trailing: true });
    this.listener = event => debouncedResize();
    window.addEventListener("resize", this.listener);
    this.props.initialSize(getSize(container));
  }

  componentWillUnmount() {
    destroyRenderer();
    window.removeEventListener("resize", this.listener);
  }

  getSize(el: HTMLElement) {
    return parseInt(
      window.getComputedStyle(el, null).getPropertyValue("height"),
      10
    );
  }

  //Fix this on width/height change
  render() {
    const { size, onMouseMove, onClick, cached, cacheKey } = this.props;
    return (
      <div className="Renderer">
        <div
          className="container"
          style={{ width: size }}
          ref={el => (this.container = el)}
        >
          <DrawCanvas cached={cached} />
          <TopCanvas
            size={2*size}
            onMouseMove={onMouseMove}
            onClick={onClick}
            cached={cached}
            cacheKey={cacheKey}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  ({
    filters,
    samples: { start, end },
    renderer: { size, cached },
    canvasCache: { cacheKey }
  }) => {
    return { size, cached, cacheKey, filters, start, end };
  },
  null,
  (stateProps, dispatchProps: any) => {
    const { dispatch } = dispatchProps;
    const { cached, filters, start, end } = stateProps;
    return {
      ...stateProps,
      onMouseMove: (
        ev: MouseEvent<HTMLCanvasElement>,
        cached: boolean,
        cacheKey: string
      ) => mousemove(ev, cached, cacheKey, node => dispatch(pickNode(node))),
      onClick: (
        ev: MouseEvent<HTMLCanvasElement>,
        cached: boolean,
        cacheKey: string
      ) => click(ev, cached, cacheKey, node => dispatch(fetchNode(node.d))),
      onResize: (size: number): FSA =>
        dispatch(
          submitFilters({
            filters,
            start,
            end,
            size
          })
        ),
      initialSize: (size: number): FSA => dispatch(resizeRenderer(size))
    };
  }
)(Renderer);
