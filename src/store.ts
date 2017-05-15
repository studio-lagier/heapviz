import { combineReducers, createStore, applyMiddleware } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';

//Reducers
import heap, {fetchNode, transferProfile, applyFilters} from './services/heap/state';
const rootReducer = combineReducers({
    heap
})

//Epics
const rootEpic = combineEpics(
    fetchNode, transferProfile, applyFilters
)

export default createStore(
    rootReducer,
    //, preloadedState
    applyMiddleware(
        createEpicMiddleware(rootEpic)
    )
);