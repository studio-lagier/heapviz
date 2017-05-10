import reducers from './reducers';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import * as HeapWorker from "worker-loader!./worker";
import createWorkerMiddleware from 'redux-worker-middleware';

const worker: Worker = new HeapWorker();

export default createStore(
    combineReducers(reducers),
    //, preloadedState
    applyMiddleware(
        createWorkerMiddleware(worker)
    )
);