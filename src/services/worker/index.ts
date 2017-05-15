import { FSA } from '../../../typings/fsa';
import * as HeapWorker from 'worker-loader!./worker';
export const worker: Worker = new HeapWorker();

import { ActionsObservable } from 'redux-observable';
const { fromEvent } = ActionsObservable;

export default worker;
export const workerMessages$: ActionsObservable<FSA> = ActionsObservable.from(fromEvent(worker, 'message'));