import * as React from 'react';
import './UnsupportedBrowserModal.pcss';

export const UnsupportedBrowserModal = () => (
    <div className="UnsupportedBrowserModal">
        <h3>Your bowser does not support WebGL or WebAssembly</h3>
        <p>Please use <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a> or <a href="https://www.google.com/chrome/browser/desktop/index.html">Google Chrome</a></p>
    </div>
);

export default UnsupportedBrowserModal;
