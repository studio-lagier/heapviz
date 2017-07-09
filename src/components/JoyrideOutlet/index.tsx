import * as React from 'react';
import { EventHandler, MouseEvent } from 'react';
import { connect } from 'react-redux';
import './JoyrideOutlet.pcss';
import Joyride from 'react-joyride';
import {actions} from '../../services/tutorial/state';
const { tutorial: { stopTutorial } } = actions;

interface JoyrideOutletProps {
    running: boolean;
    stop: any;
    hasCurrentNode: boolean;
    hasSamples: boolean;
}

function getSteps(hasCurrentNode: boolean, hasSamples: boolean): any[] {
    const steps = []
    steps.push({
        selector: '.Renderer',
        text: `<p>This is the heap profile visualization.</p>
        <p>The outer circle of each node represents its <strong>retained size</strong>, the inner circle represents its <strong>self size</strong>.</p>
        <p>Each node is colored according to its type.</p>
        <p>You can hover and click on nodes to inspect them further.</p>`,
        position: 'left',
        style: { width: '255px' }
    });

    if (hasSamples) {
        steps.push({
            selector: '.SampleSelector',
            text: `<p>This is the sample selector. You can use it to display a different range of samples.</p>
            <p>When you load a profile, only the first sample is displayed. You can click and drag to select a new range of samples.</p>
            <p>You can also press left or right to update the end of the selected sample and shift+left or shift+right to update the start of the selected sample.</p>`,
            position: 'bottom'
        });
    }

    steps.push({
        selector: '.Filters',
        text: `<p>This is the filters window.</p>
        <p>Any node that has a value greater than the filtered property will be displayed.</p>
        <p>By default, we only show nodes with both a self and a retained size larger than 100.</p>
        <p>You can increase or reduce the filter, or filter by node type.</p>
        <p>Be careful reducing the filter on large profiles (more than ~120MB) - it can make the profile extremely slow to render.</p>
        `,
        position: 'right'
    });

    steps.push({
        selector: '.StatsWindow',
        text: `<p>This is the profile stats window. It shows statistics for the entire profile, such as total size, number of nodes, and number of samples.<p>`,
        position: 'right'
    });

    steps.push({
        selector: '.HoverNode',
        text: `<p>The hovered node window displays the stats for the node you are currently hovering over.</p>
        <p>Click on a node for a more detailed view of the node, including its name and a detailed list of its edges and retainers.</p>
        <p>Using this information gives you clues as to what the node is and where you can find it in your app.</p>
        `,
        position: 'left'
    });

    if (hasCurrentNode) {
        steps.push({
            selector: '.CurrentNode',
            text: `<p>The current node window displays the stats for the currently active node.</p>
            <p>If the node has retainers or edges, you can click on those buttons to get a list view of them.</p>
            <p>Reviewing retainers and edges is the best way to figure out where in code a node can be found.</p>
            `,
            position: 'left'
        })
    }

    return steps;
}

function getStrings() {
    return { back: 'Back', close: 'Close', last: 'Done', next: 'Next', skip: 'Skip' }
}

export class JoyrideOutlet extends React.Component<JoyrideOutletProps, {}> {
    joyride: any;
    doStop({ type }: {type:string}) {
       if (type !== 'finished') return true;
        (this.refs.joyride as any).reset(true);
        this.props.stop();
     }
    render() {
        const { running, hasCurrentNode, hasSamples } = this.props;
        return (
            <Joyride
                ref="joyride"
                run={running}
                callback={this.doStop.bind(this)}
                steps={getSteps(hasCurrentNode, hasSamples)}
                autoStart={true}
                locale={getStrings()}
                type="continuous"
            />
        );
    }
}

export default connect(
    ({ samples: { stats }, heap: { currentNode }, tutorial: { running } }) => {
        const hasSamples = stats && stats.samples && stats.samples.length > 1;
        return {
            running,
            hasCurrentNode: !!currentNode,
            hasSamples
        };
    },
    dispatch => {
        return {
            stop: () => dispatch(stopTutorial())
        }
    }
)(JoyrideOutlet);
