export class Node {
    id: number;
    distance: number;
    className: string;
    itemIndex: number;
    retainersCount: number;
    name: string;
    type: string;
    selfSize: number;
    retainedSize: number;
    edgesCount: number;
    edges: Array<any>;
    [key: string]: any;

    constructor(rawNode: any) {
        ['id', 'distance', 'className', 'itemIndex', 'retainersCount', 'name', 'type', 'selfSize', 'retainedSize', 'edgesCount']
            .forEach(prop => this[prop] = rawNode[prop]());
    }
};