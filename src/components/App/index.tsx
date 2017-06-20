import * as React from 'react';
import { Component } from 'react';
import logo from './logo.svg';
import './App.pcss';
import store from '../../store';
import { connect } from 'react-redux';
import Renderer from '../Renderer';
import { Redirect } from 'react-router-dom';

interface AppProps {
  message: string;
  showMessage: boolean;
  stats: any;
  hasFile: boolean;
}

export const App = ({ showMessage, message, stats, hasFile }: AppProps) => {
  return hasFile ?
    (
      <div className="App">
        <div className={`message ${showMessage ? 'visible' : ''}`}>
          <div className="text">{message}</div>
        </div>
        <Renderer />
      </div>
    ) :
    (<Redirect to='/'/>)
}

export default connect(
  ({ heap: { stats }, file: { hasFile }, messages: {showing:showMessage, message} }) => {
    return { message, showMessage, stats, hasFile }
  }
)(App);
