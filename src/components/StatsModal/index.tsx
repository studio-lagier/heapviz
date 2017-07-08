import * as React from 'react';
import './StatsModal.pcss';
import Stats from '../Stats';
import { Node } from '../../services/worker/heap-profile-parser';
import * as filesize from 'filesize';
import 'react-table/react-table.css';
import ReactTable from 'react-table';

interface Edge {
    edgeIndex: number;
    name: string;
    node: Node;
    type: string;
}

interface EdgesProps {
    edges: any;
    title: string;
}

interface Stats {
    name: string;
    type: string;
    nodeName: string;
    nodeRetainedSize: string;
    nodeSelfSize: string;
    nodeType: string;
    [key: string]: string | number;
}

function columns() {
    return [
        {
            Header: 'ID',
            accessor: 'edgeIndex'
        },
        {
            Header: 'Name',
            accessor: 'name'
        },
        {
            Header: 'Type',
            accessor: 'type'
        },
        {
            Header: 'Node Name',
            accessor: 'node.name'
        },
        {
            Header: 'Node Type',
            accessor: 'node.type'
        },
        {
            id: 'nodeRetainedSize',
            Header: 'Node Retained Size',
            accessor: 'node.retainedSize',
            Cell: (props:any) => filesize(props.value)
        },
        {
            id: 'nodeSelfSize',
            Header: 'Node Self Size',
            accessor: 'node.selfSize',
            Cell: (props:any) => filesize(props.value)
        }

    ]
}

export const StatsModal = ({ edges, title }: EdgesProps) => {
    return (
        <div className="StatsModal">
            <h3>{title}</h3>
            <ReactTable
                data={edges}
                columns={columns()}
                showPageSizeOptions={false}
                defaultPageSize={14}
                defaultSorted={[{
                    id: 'nodeRetainedSize',
                    desc: true,
                }]}
            />
        </div>
    )
};

export default StatsModal;