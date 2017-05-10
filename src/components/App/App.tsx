import * as React from 'react';
import { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import store from '../../store';

export interface AppProps { }

export class App extends Component<AppProps, undefined> {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
          This is a new thing.
        </p>
      </div>
    );
  }
}

export default App;
