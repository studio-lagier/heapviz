import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

//Reducers
import heap, { fetchNode, transferProfile, applyFilters, decodeNodes, addProgressUpdateMessages } from './services/heap/state';
import file, { loadFile, onFileLoaded } from './services/file/state';
import renderer, { renderNodes, createTextures } from './services/renderer/state';
import messages, { showMessage, hideMessage } from './services/messages/state';
export const history = createHistory();
const rootReducer = combineReducers({
    heap, file, renderer, messages,
    router: routerReducer
})

//Epics
const rootEpic = combineEpics(
    fetchNode, transferProfile, applyFilters, decodeNodes, addProgressUpdateMessages,
    loadFile, onFileLoaded,
    renderNodes, createTextures,
    showMessage, hideMessage
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