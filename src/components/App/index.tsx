import * as React from 'react';
import { Component } from 'react';
import logo from './logo.svg';
import './App.pcss';
import store from '../../store';
import { connect } from 'react-redux';
import Renderer from '../Renderer';
import StatsWindow from '../StatsWindow';
import HoverNode from '../HoverNode';
import CurrentNode from '../CurrentNode';
import { Redirect } from 'react-router-dom';
import { Node } from '../../services/worker/heap-profile-parser';

interface AppProps {
  message: string;
  showMessage: boolean;
  computing: boolean;
  stats: any;
  hasFile: boolean;
  hoverNode: Node;
  currentNode: Node;
}

export const App = ({ showMessage, computing, message, stats, hasFile, hoverNode, currentNode }: AppProps) => {
  return hasFile ?
    (
      <div className="App">
        <div className={`message ${showMessage ? 'visible' : ''}`}>
          <div className="text">{message}</div>
        </div>

        {!computing ?
          <Renderer /> :
          null
        }

        {stats ?
          <StatsWindow stats={stats} /> :
          null
        }

        <div className="right-stats">
          {
            hoverNode ?
              <HoverNode node={hoverNode} /> :
              null
          }
          {
            currentNode ?
              <CurrentNode node={currentNode} /> :
              null
          }
        </div>
        {/*<Filters />*/}
      </div>
    ) :
    (<Redirect to='/'/>)
}

export default connect(
  ({ heap: { stats, computing, hoverNode, currentNode }, file: { hasFile }, messages: {showing:showMessage, message} }) => {
    return { message, hoverNode, currentNode, showMessage, stats, hasFile, computing }
  }
)(App);
