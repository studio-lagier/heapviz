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
import Filters from '../Filters';
import { Redirect } from 'react-router-dom';
import { Node } from '../../services/worker/heap-profile-parser';

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

export const App = ({ showMessage, computing, drawing, message, stats, hasFile, hoverNode, currentNode, nodesLength }: AppProps) => {
  console.log({showMessage, computing, drawing})
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

        <Filters />

        {stats ?
          <StatsWindow stats={stats} length={nodesLength}/> :
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
      </div>
    ) :
    (<Redirect to='/'/>)
}

export default connect(
  ({ heap: { stats, computing, hoverNode, currentNode, nodesLength }, file: { hasFile }, renderer: {drawing }, messages: {showing:showMessage, message} }) => {
    return { message, hoverNode, currentNode, showMessage, stats, hasFile, computing, drawing, nodesLength }
  }
)(App);
