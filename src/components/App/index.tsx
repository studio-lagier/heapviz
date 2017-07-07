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
import { Redirect } from "react-router-dom";
import { Node } from "../../services/worker/heap-profile-parser";

interface AppProps {
  message: string;
  showMessage: boolean;
  computing: boolean;
  drawing: boolean;
  stats: any;
  hasFile: boolean;
  hoverNode: Node;
  currentNode: Node;
  nodesLength: number;
}

export const App = ({
      hasFile,
      showMessage,
      computing,
      drawing,
      message,
      stats,
      nodesLength,
      hoverNode,
      currentNode
    }:AppProps) => {
  return hasFile
      ? <div className="App">
        {/*Dumb conditional here because of timing issues with very fast renders meaning we can get SHOW_MESSAGE's from our worker after our render has completed and triggered HIDE_MESSAGE*/}
        <div
          className={`message ${showMessage && (computing || drawing)
            ? "visible"
            : ""}`}
        >
          <div className="text">
            {message}
          </div>
        </div>

        {stats ? <SampleSelector /> : null}

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
          {currentNode ? <CurrentNode node={currentNode} /> : null}
        </div>
      </div>
      : <Redirect to="/" />;
}

export default connect(
  ({
    samples: { stats },
    heap: { computing, hoverNode, currentNode, nodesLength },
    file: { hasFile },
    renderer: { drawing },
    messages: { showing: showMessage, message }
  }) => {
    return {
      message,
      hoverNode,
      currentNode,
      showMessage,
      stats,
      hasFile,
      computing,
      drawing,
      nodesLength
    };
  }
)(App);
