import { combineReducers, createStore, applyMiddleware } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

//Reducers
import heap, { fetchNode, transferProfile, applyFilters } from './services/heap/state';
export const history = createHistory();
const rootReducer = combineReducers({
    heap,
    router: routerReducer
})

//Epics
const rootEpic = combineEpics(
    fetchNode, transferProfile, applyFilters
)

export const store = createStore(
    rootReducer,
    //, preloadedState
    applyMiddleware(
        createEpicMiddleware(rootEpic),
        routerMiddleware(history)
    )
);

export default store;