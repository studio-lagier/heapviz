import * as React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import './Header.pcss';

interface HeaderProps { }

export class Header extends Component<HeaderProps, {}> {
  render() {
    return (
        <header>
            <h1>Chrome Heap Profile Vizualization Tool</h1>
             <span className="fork-me">Fork me on Github</span>
        </header>
    );
  }
}



export default Header;
