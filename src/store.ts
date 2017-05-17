import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

//Reducers
import heap, { fetchNode, transferProfile, applyFilters } from './services/heap/state';
import file, { loadFile } from './services/file/state';
export const history = createHistory();
const rootReducer = combineReducers({
    heap, file,
    router: routerReducer
})

//Epics
const rootEpic = combineEpics(
    fetchNode, transferProfile, applyFilters,
    loadFile
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