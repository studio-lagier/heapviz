import * as React from 'react';
import './CurrentNode.pcss';
import Stats from '../Stats';
import Edges from '../Edges';
import { Node } from '../../services/worker/heap-profile-parser';
import * as filesize from 'filesize';


interface CurrentNodeProps {
    node: any;
}

interface Stats {
    [key: string]: string | number;
}

function nodeToStats(node: Node): Stats {
    const { id, edgesCount, className, name, selfSize, retainedSize, retainersCount, distance } = node;
    return {
        id,
        edgesCount,
        retainersCount,
        selfSize: filesize(selfSize),
        retainedSize: filesize(retainedSize),
        className,
        name,
        distance
    }
}

export const CurrentNode = ({ node }: CurrentNodeProps) => {
    const stats = nodeToStats(node);
    return (
        <div className="CurrentNode">
            <strong>Selected Node</strong>
            <div className="stats">
                <Stats stats={stats} />
            </div>
            <button>Edges</button>
            <button>Retainers</button>
            <div className="edges">
                <Edges edges={node.edges} title='Edges' />
            </div>
            <div className="retainers">
                <Edges edges={node.retainers} title='Retainers' />
            </div>
        </div>
    )
};

export default CurrentNode;