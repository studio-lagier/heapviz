import { bindActionCreators } from 'redux';
import { createActions } from 'redux-actions';
import store from './store';
import MT from './message-types';
const { dispatch } = store;

const enableWorker = { WebWorker: true };

export default bindActionCreators(createActions({
    FILE: {

    },
    HEAP: {
        [MT.APPLY_FILTERS]: [
            (p: { filters: any, idx: number, width: number }) => p,
            enableWorker
        ],
        [MT.FETCH_NODE]: [
            (p: { idx: number }) => p,
            enableWorker
        ],
        [MT.TRANSFER_PROFILE]: [
            (p: {heap: ArrayBufferView}) => p,
            enableWorker
        ]
    }
}), dispatch);