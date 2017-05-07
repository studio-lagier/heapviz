interface WebInspector {
    [key: string]: any;
}

export const WebInspector: WebInspector = {};

import './Utilities';
import './UIString';
import './AllocationProfile';
import './HeapSnapshotCommon';
import './HeapSnapshotProgress';
import './HeapSnapshot';
import './JSHeapSnapshot';

export default WebInspector;