import * as React from 'react';
import { MouseEvent } from 'react';
import { connect } from 'react-redux';
import './ModalOutlet.pcss';
import HelpModal from '../HelpModal';
import StatsModal from '../StatsModal';
import UnsupportedBrowserModal from '../UnsupportedBrowserModal';
import { Node } from '../../services/worker/heap-profile-parser';
import { actions } from '../../services/modal/state';

interface ModalOutletProps {
    active: boolean;
    name: string;
    currentNode: Node;
    close: () => any;
}

function getActiveModal(name: string, node: Node) {
    switch (name) {
        case 'help':
            return <HelpModal />
        case 'retainers':
            return <StatsModal title="Retainers" edges={node.retainers} />
        case 'edges':
            return <StatsModal title="Edges" edges={node.edges} />
        case 'unsupported':
            return <UnsupportedBrowserModal />
        default:
            return null;
    }
}

export class ModalOutlet extends React.Component<ModalOutletProps, {}> {
    closeListener: any;

    componentDidMount() {
        this.closeListener = (ev: KeyboardEvent) => {
            const { active, close } = this.props;
            if (active && ev.keyCode === 27) {
                close();
            }
        }
        window.addEventListener('keydown', this.closeListener);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.closeListener);
    }

    maybeClose(ev: MouseEvent<HTMLDivElement>) {
        const { close } = this.props;
        const { target } = ev;
        ~(target as any).className.indexOf('ModalOutlet') && close();

    }

    render() {
        const { active, name, currentNode, close } = this.props;
        return (
            <div className={`ModalOutlet ${active ? 'active' : ''}`} onClick={ev => this.maybeClose(ev)}>
                <div className="close-x" onClick={close}>✕</div>
                <div className='Modal'>
                    {getActiveModal(name, currentNode)}
                </div>
            </div>
        );
    }
}

const { modal: { hideModal } } = actions;
export default connect(
    ({ modal: { active, name }, heap: {currentNode} }) => {
        return { active, name, currentNode };
    },
    dispatch => {
        return {
            close: () => dispatch(hideModal())
        }
    }
)(ModalOutlet);
