import * as React from "react";
import { Component, ComponentState } from "react";
import logo from "./logo.svg";
import "./App.pcss";
import store from "../../store";
import { connect } from "react-redux";
import Renderer from "../Renderer";
import StatsWindow from "../StatsWindow";
import SampleSelector from "../SampleSelector";
import HoverNode from "../HoverNode";
import CurrentNode from "../CurrentNode";
import Filters from "../Filters";
import Loader from "../Loader";
import { Redirect } from "react-router-dom";
import { Node } from "../../services/worker/heap-profile-parser";
import { FSA } from '../../../typings/fsa';
import { actions } from '../../services/modal/state';

const { modal: { showModal } } = actions;

interface AppProps {
  message: string;
  showMessage: boolean;
  computing: boolean;
  drawing: boolean;
  stats: any;
  hasFile: boolean;
  fetching: boolean;
  hoverNode: Node;
  currentNode: Node;
  nodesLength: number;
  showEdges: () => FSA;
  showRetainers: () => FSA;
}

export const App = ({
      hasFile,
      fetching,
      showMessage,
      computing,
      drawing,
      message,
      stats,
      nodesLength,
      hoverNode,
      currentNode,
      showEdges,
      showRetainers
    }:AppProps) => {
  return hasFile
      ? <div className="App">
        {/*Dumb conditional here because of timing issues with very fast renders meaning we can get SHOW_MESSAGE's from our worker after our render has completed and triggered HIDE_MESSAGE*/}
        <Loader
          visible={showMessage && fetching || computing || drawing}
          message={message}
        />

        {stats && stats.samples.length > 1 ? <SampleSelector /> : null}

        <div className="left-rail">
          {!computing
            ? <Filters />
            : null}

          {stats ? <StatsWindow stats={stats} length={nodesLength} /> : null}
        </div>

        <div className="main-window">
        {!computing
          ? <Renderer />
          : null}
        </div>

        <div className="right-rail">
          {hoverNode ? <HoverNode node={hoverNode} /> : null}
          {
          currentNode ?
            <CurrentNode
              node={currentNode}
              showEdges={showEdges}
              showRetainers={showRetainers}
            /> : null}
        </div>
      </div>
      : <Redirect to="/" />;
}

export default connect(
  ({
    samples: { stats },
    heap: { computing, hoverNode, currentNode, nodesLength },
    file: { hasFile, fetching },
    renderer: { drawing },
    messages: { showing: showMessage, message }
  }) => {
    return {
      hasFile: fetching || hasFile,
      fetching,
      message,
      hoverNode,
      currentNode,
      showMessage,
      stats,
      computing,
      drawing,
      nodesLength
    };
  },
  dispatch => {
    return {
      showEdges: () => dispatch(showModal('edges')),
      showRetainers: () => dispatch(showModal('retainers'))
    }
  }
)(App);
