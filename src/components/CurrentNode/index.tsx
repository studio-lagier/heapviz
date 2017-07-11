import * as React from 'react';
import './CurrentNode.pcss';
import Stats from '../Stats';
import { Node } from '../../services/worker/heap-profile-parser';
import * as filesize from 'filesize';
import { FSA } from '../../../typings/fsa';

interface CurrentNodeProps {
    node: any;
    showEdges: () => FSA;
    showRetainers: () => FSA;
}

interface Stats {
    [key: string]: string | number;
}

function nodeToStats(node: Node): Stats {
    const { id, edgesCount, className, name, selfSize, retainedSize, retainersCount, distance, type } = node;
    return {
        id,
        type,
        edgesCount,
        retainersCount,
        selfSize: filesize(selfSize),
        retainedSize: filesize(retainedSize),
        className,
        name,
        distance
    }
}

export const CurrentNode = ({ node, showEdges, showRetainers }: CurrentNodeProps) => {
    const stats = nodeToStats(node);
    return (
        <div className="CurrentNode module">
            <h3>Selected Node</h3>
            <div className="stats">
                <Stats stats={stats} />
            </div>
            {
                node.edges.length ?
                    <button className="btn waves-effect waves-light" onClick={showEdges}>Edges</button> :
                    null
            }
            {
                node.retainers.length ?
                    <button className="btn waves-effect waves-light" onClick={showRetainers}>Retainers</button> :
                    null
            }
        </div>
    )
};

export default CurrentNode;