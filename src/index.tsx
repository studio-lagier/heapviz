import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'materialize-css/dist/css/materialize.css';
import 'react-joyride/lib/react-joyride-compiled.css'
import 'materialize-css/dist/js/materialize.js';
import { Provider } from 'react-redux';
import { store, history } from './store';
import { Route } from 'react-router';
import { ConnectedRouter, push } from 'react-router-redux';
import FileUploadWindow from './components/FileUploadWindow';
import App from './components/App';
import ModalOutlet from './components/ModalOutlet';


ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div className="main">
        <Route exact path="/" component={FileUploadWindow as any} />
        <Route path="/viz" component={App as any} />
        <ModalOutlet />
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
