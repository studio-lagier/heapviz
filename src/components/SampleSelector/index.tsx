import * as React from 'react';
import { connect } from 'react-redux';
import './SampleSelector.pcss';
import Sample from '../Sample';
import { Sample as iSample } from '../../services/samples/state';
import { FSA } from '../../../typings/fsa';
import { actions } from '../../services/samples/state';
import { getStart, getEnd } from '../../services/samples';
import { actions as filterActions } from '../../services/filters/state';

interface SampleSelectorProps {
    samples: iSample[];
    total: number;
    start: number;
    end: number;
    filters: any;
    size: number;
    onKeyDown: (ev: Event, start: number, end: number) => FSA | void
}

export class SampleSelector extends React.Component<SampleSelectorProps, {}> {

    listener: any;

    componentDidMount() {
        this.listener = (ev: KeyboardEvent) => {
            const { onKeyDown, start, end } = this.props;
            onKeyDown(ev, start, end);
        }
        window.addEventListener('keydown', this.listener)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.listener);
    }

    isSelected(i: number) {
        const { start, end } = this.props
        return i >= start && i <= end;
    }

    render() {
        const { samples, start, end, total } = this.props;
        const sampleWidth = 500 / samples.length;
        return (
            <div className="SampleSelector">
                <div className="Selected" style={{
                    left: start * sampleWidth,
                    width: (1 + end - start) * sampleWidth
                }}/>
                <div className="Samples">
                    {samples.map((sample, i) =>
                        <Sample key={i} sample={sample} total={total} maxHeight={50} width={sampleWidth} left={i * sampleWidth}
                        selected={this.isSelected(i)}
                        />
                        )}
                </div>
            </div>
        )
    }
};

const { samples: { updateStart, updateEnd } } = actions;
const { filters: { submitFilters } } = filterActions;
export default connect(({ samples: { stats, start, end }, filters, renderer: { size } }) => {
    const { samples, totals: { total } } = stats;
    return {samples, total, start, end, size, filters}
},
    null,
    (stateProps, dispatchProps:any) => {
        const { dispatch } = dispatchProps;
        const { start, end, samples, filters, size } = stateProps;
        return {
            ...stateProps,
            onKeyDown: (ev: KeyboardEvent, start: number, end: number) => {
                let _start = start, _end = end;

                if (ev.shiftKey) {
                    if (ev.keyCode === 37) _start = getStart(start, end, samples, false);
                    if (ev.keyCode === 39) _start = getStart(start, end, samples, true);
                } else {
                    if (ev.keyCode === 37) _end = getEnd(start, end, samples, false);
                    if (ev.keyCode === 39) _end = getEnd(start, end, samples, true);
                }

                if (_start !== start) dispatch(updateStart(_start))
                if (_end !== end) dispatch(updateEnd(_end))

                if (_start !== start || _end !== end) {
                    dispatch(submitFilters({
                        start: _start,
                        end: _end,
                        size,
                        filters
                    }))
                }
            }
        }
    }
)(SampleSelector);
