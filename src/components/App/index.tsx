import * as React from 'react';
import { Component } from 'react';
import logo from './logo.svg';
import './App.pcss';
import store from '../../store';
import FileUploadWindow from '../FileUploadWindow';

export class App extends Component<any, any> {
  render() {
    return (
      <div className="App">
        <FileUploadWindow />
      </div>
    );
  }
}

export default App;
