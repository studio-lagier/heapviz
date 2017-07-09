import * as React from 'react';
// import { Link } from 'react-router-dom';
import './Header.pcss';

export const Header = () => (
    <header>
        <h1 className="logo">HeapViz!</h1>
        <h2>A tool for vizualizing Chrome heap timelines and snapshots</h2>
        <a href="https://github.com/tomlagier/heapviz" className="fork-me">
            <img src="https://camo.githubusercontent.com/e7bbb0521b397edbd5fe43e7f760759336b5e05f/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677265656e5f3030373230302e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_green_007200.png"/>
        </a>
    </header>
);

export default Header;
