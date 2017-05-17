import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'materialize-css/dist/css/materialize.css';
import { Provider } from 'react-redux';
import { store, history } from './store';
import { Route } from 'react-router';
import { ConnectedRouter, push } from 'react-router-redux';
import { Header } from './components/Header';
import FileUploadWindow from './components/FileUploadWindow';
import { App } from './components/App';


ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div className="main">
        <Header />
        <Route exact path="/" component={FileUploadWindow as any} />
        <Route path="/viz" component={App as any} />
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
