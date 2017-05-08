import * as _ from 'lodash';
import '../vsprintf';
import { WebInspector } from './web-inspector';
import { Node, Dispatcher, HeapProfile } from './heap-profile-parser';
import { hierarchy, pack } from 'd3';

const dispatcher = new Dispatcher(self, self.postMessage.bind(self));
let heapProfile: HeapProfile;


function serializeResponse(nodes: Array<Node>) {
    const te = new TextEncoder();
    return te.encode(JSON.stringify(nodes)).buffer;
}

function transferNodes(nodes: Array<any>) {

    const ab = serializeResponse(nodes);

    dispatcher.sendEvent('SendNodes', ab, [ab]);

    return Promise.resolve();
}

// TODO: rewrite this to use rxjs instead
const MAX_NODES = 1000000;
self.onmessage = e => {
    const {data:d} = e;
    switch (d.command) {
        case 'TransferProfile':
            const decoder = new TextDecoder();
            const file = decoder.decode(d.data.heap);

            dispatcher.sendEvent('ProgressUpdate', 'Generating samples...');
            heapProfile = new HeapProfile(JSON.parse(file), dispatcher);
            dispatcher.sendEvent('ProgressUpdate', 'Generating statistics...');
            const stats = heapProfile.fetchStats();
            dispatcher.sendEvent('ProgressUpdate', 'Transferring data from worker...');

            dispatcher.sendEvent('ProfileLoaded', {
                stats,
                nodeTypes: heapProfile.snapshot._nodeTypes
            });
            break;
        case 'ApplyFilters':
            //Send samples across in chunks here
            const children = heapProfile.applyFilters(d);
            if (children.length > MAX_NODES) {
                dispatcher.sendEvent('ProgressUpdate', `Current filter contains ${children.length} nodes, max nodes is ${MAX_NODES}. Please increase filter to reduce number of visible nodes`);
                return;
            }

            const root = hierarchy({retainedSize: 0, children})
                .sum(node => node.retainedSize);

            const layout = pack()
                .size([d.width, d.width])
                .padding(1.5);

            const nodes = layout(root).leaves()
            nodes.forEach(node => delete node.parent);

            transferNodes(nodes)
                .then(() => dispatcher.sendEvent('TransferComplete'));
            break;
        case 'FetchNode':
            const idx = e.data.idx;
            const node = heapProfile.fetchNode(idx);
            dispatcher.sendEvent('NodeFetched', { idx, node });
            break;

    }
};