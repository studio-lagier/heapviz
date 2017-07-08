import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

//Reducers
import heap, { fetchNode, transferProfile, applyFilters, decodeNodes, applyInitialFilters, addProgressUpdateMessages } from './services/heap/state';
import file, { loadFile, onFileLoaded } from './services/file/state';
import renderer, { renderNodes, createTextures, renderIfCached } from './services/renderer/state';
import messages, { showMessage, hideMessage } from './services/messages/state';
import filters from './services/filters/state';
import samples from './services/samples/state';
import canvasCache, { onApplyFilters } from './services/canvasCache/state';
import modal from './services/modal/state';
export const history = createHistory();
const rootReducer = combineReducers({
    heap, file, renderer, messages, filters, samples,
    canvasCache, modal,
    router: routerReducer
})

//Epics
const rootEpic = combineEpics(
    fetchNode, transferProfile, applyFilters, decodeNodes, addProgressUpdateMessages,
    loadFile, onFileLoaded,
    renderNodes, createTextures,
    showMessage, hideMessage,
    onApplyFilters, applyInitialFilters,
    renderIfCached
)

 const composeEnhancers: Function = (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
    rootReducer,
    //, preloadedState
    composeEnhancers(
        applyMiddleware(
            createEpicMiddleware(rootEpic),
            routerMiddleware(history)
        )
    )
);

export default store;