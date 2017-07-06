import * as React from 'react';
import { MouseEvent as ME } from 'react';
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
    onKeyDown: (ev: Event, start: number, end: number) => void
    dragEnd: (start: number, end: number) => void
}

interface SampleSelectorState {
    isDragging: boolean;
    dragStart: number;
    dragCurrent: number;
    leftOffset: number;
}

//TODO: Clean this bad larry up. Too much going on here!
export class SampleSelector extends React.Component<SampleSelectorProps, SampleSelectorState> {

    listener: any;
    mouseMoveListener: (e: MouseEvent) => void;
    mouseUpListener: (e:MouseEvent) => void;
    hitbox: HTMLDivElement;

    constructor() {
        super();
        this.state = {
            isDragging: false,
            dragStart: null,
            dragCurrent: null,
            leftOffset: null
        }
    }

    componentDidMount() {
        this.listener = (ev: KeyboardEvent) => {
            const { onKeyDown, start, end } = this.props;
            onKeyDown(ev, start, end);
        }

        window.addEventListener('keydown', this.listener);
    }


    componentWillUnmount() {
        window.removeEventListener('keydown', this.listener);
    }

    isSelected(i: number) {
        const { start, end } = this.props
        return i >= start && i <= end;
    }

    getSampleWidth() {
        const { samples } = this.props;
        return 500 / samples.length;
    }

    getSelectedStyle() {
        const { start, samples, end } = this.props;
        const { isDragging, dragStart, dragCurrent } = this.state;
        const sampleWidth = this.getSampleWidth();

        if (!isDragging) {
            return {
                left: start * sampleWidth + 10,
                width: (1 + end - start) * sampleWidth
            }
        }

        return {
            left: Math.min(dragStart, dragCurrent),
            width: Math.abs(dragCurrent - dragStart)
        }
    }

    onMouseDown(ev: ME<HTMLDivElement>) {
        const { clientX } = ev;
        this.setState(state => {
            const { left } = this.hitbox.getBoundingClientRect();
            return {
                ...state,
                isDragging: true,
                dragStart: Math.max(clientX - left, 0),
            };
        });

        this.mouseMoveListener = e => this.onMouseMove(e);
        this.mouseUpListener = e => this.onMouseUp();

        window.addEventListener('mousemove', this.mouseMoveListener);
        window.addEventListener('mouseup', this.mouseUpListener);
    }

    onMouseMove(ev: MouseEvent) {
        ev.preventDefault();
        const { clientX } = ev;
        const { left, right } = this.hitbox.getBoundingClientRect();
        this.setState(state => {
            return {
                ...state,
                dragCurrent: Math.min(Math.max(clientX - left, 0), right - left)
            }
        })
    }

    onMouseUp() {
        window.removeEventListener('mousemove', this.mouseMoveListener);
        window.removeEventListener('mouseup', this.mouseUpListener);

        this.setState(state => {
            return {
                ...state,
                isDragging: false
            };
        });

        const { dragStart, dragCurrent } = this.state;
        const { dragEnd, samples } = this.props;
        const sampleWidth = this.getSampleWidth();

        //Offset by 10 because of our 10 px of wiggle room at the start of the timeline
        const ds = dragStart - 10;
        const dc = dragCurrent - 10;

        const start = Math.floor(Math.max(Math.min(ds, dc), 0) / sampleWidth)
        const end = Math.ceil(Math.min(Math.max(ds, dc), 500) / sampleWidth);
        //Special cases for 0 and samples.length - 1 because otherwise we render the first
        // and last samples unselectable due to the nature of getStart and getEnd
        const newStart = start === 0 ?
            0 :
            getStart(start, end, samples, true);
        const newEnd = end === samples.length - 1 ?
            end :
            getEnd(newStart, end, samples, false);

        dragEnd(newStart, newEnd);
    }

    render() {
        const { samples, start, end, total } = this.props;
        const sampleWidth = this.getSampleWidth();
        return (
            <div
                className="SampleSelector"
                onMouseDown={e => this.onMouseDown(e)}
                ref={hitbox => this.hitbox = hitbox}>
                <div className="Selected" style={this.getSelectedStyle()}/>
                <div className="Samples">
                    {samples.map((sample, i) =>
                        <Sample key={i} sample={sample} total={total} maxHeight={50} width={sampleWidth} left={10+ i * sampleWidth}
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
            },
            dragEnd: (start: number, end: number) => {
                dispatch(updateStart(start));
                dispatch(updateEnd(end));
                dispatch(submitFilters({
                    start, end, size, filters
                }))
            }
        }
    }
)(SampleSelector);
