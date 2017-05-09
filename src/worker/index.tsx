import * as _ from 'lodash';
import './lib/vsprintf';
import { WebInspector } from './web-inspector';
import { Node, Dispatcher, HeapProfile } from './heap-profile-parser';
import { hierarchy, pack } from 'd3';
import { Observable } from 'rxjs';
import MT from '../message-types';
import { FluxStandardAction } from '../../typings/fsa';

const { fromEvent } = Observable;
const dispatcher = new Dispatcher(self, self.postMessage.bind(self));
let heapProfile: HeapProfile;
const MAX_NODES = 1000000;

function serializeResponse(nodes: Array<Node>) {
    const te = new TextEncoder();
    return te.encode(JSON.stringify(nodes)).buffer;
}

function transferNodes(nodes: Array<any>) {
    const ab = serializeResponse(nodes);
    dispatcher.sendEvent(MT.SEND_NODES, ab, [ab]);
    return Promise.resolve();
}

function fromHeap(heap: ArrayBufferView) {
    const decoder = new TextDecoder();
    const file = decoder.decode(heap);
    const profile = new HeapProfile(JSON.parse(file), dispatcher);
    return profile;
}

function receiveProfile({ heap }: { heap: ArrayBufferView }) {
    dispatcher.sendEvent(MT.PROGRESS_UPDATE, 'Generating samples...');
    heapProfile = fromHeap(heap);
    dispatcher.sendEvent(MT.PROGRESS_UPDATE, 'Generating statistics...');
    const stats = heapProfile.fetchStats();
    dispatcher.sendEvent(MT.PROGRESS_UPDATE, 'Transferring data from worker...');

    dispatcher.sendEvent(MT.PROFILE_LOADED, {
        stats,
        nodeTypes: heapProfile.snapshot._nodeTypes
    });
}

function generateLayout(children: Node[], width: number) {
    const root = hierarchy({ retainedSize: 0, children })
        .sum(node => node.retainedSize);

    const layout = pack()
        .size([width, width])
        .padding(1.5);

    const nodes = layout(root).leaves()
    nodes.forEach(node => delete node.parent);
    return nodes;
}

function applyFilters(
    { filters, idx, width }:
        { filters: any, idx: number, width: number }
) {
    //Send samples across in chunks here
    const children = heapProfile.applyFilters({filters, idx});
    if (children.length > MAX_NODES) {
        dispatcher.sendEvent(MT.PROGRESS_UPDATE, `Current filter contains ${children.length} nodes, max nodes is ${MAX_NODES}. Please increase filter to reduce number of visible nodes`);
        return;
    }

    const nodes = generateLayout(children, width);

    transferNodes(nodes)
        .then(() => dispatcher.sendEvent(MT.TRANSFER_COMPLETE));
}

function fetchNode({ idx }: {idx: number}) {
    const node = heapProfile.fetchNode(idx);
    dispatcher.sendEvent(MT.NODE_FETCHED, { idx, node });
}

interface HeapWorkerMessageEvent extends MessageEvent {
    data: FluxStandardAction<any, any>
}

const source = fromEvent(self, 'message');
const subscription = source.subscribe((e: HeapWorkerMessageEvent) => {
    const { data: {type, payload} } = e;
    switch (type) {
        case MT.TRANSFER_PROFILE:
            receiveProfile(payload);
            break;
        case MT.APPLY_FILTERS:
            applyFilters(payload);
            break;
        case MT.FETCH_NODE:
            fetchNode(payload);
            break;
    }
});

export default self;