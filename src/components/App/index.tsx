import * as React from 'react';
import { Component } from 'react';
import logo from './logo.svg';
import './App.pcss';
import store from '../../store';
import { connect } from 'react-redux';
import Renderer from '../Renderer';

interface AppProps {
  message: string;
  computing: boolean;
  stats: any;
}

export const App = ({message, computing, stats}: AppProps) => (
    <div className="App">
      Visualization goes here
      <div className="computing">
        { computing ? "Computing!" : "Not computing... "}
      </div>
      <div className="message">
        {message}
      </div>
      <Renderer/>
    </div>
);

export default connect(
  ({ heap: { message, computing, stats } }) => {
    return { message, computing, stats }
  }
)(App);
