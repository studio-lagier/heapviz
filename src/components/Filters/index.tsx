import * as React from 'react';
import { EventHandler, MouseEvent, ChangeEvent } from 'react';
import './Filters.pcss';
import Filter from '../Filter';
import SelectFilter from '../SelectFilter';
import { connect } from 'react-redux';
import { actions, FilterState } from '../../services/filters/state';
import { SamplesState } from '../../services/samples/state';

interface FiltersProps {
    onChange: Function;
    onClick: Function;
    filters: FilterState;
    samples: SamplesState;
    nodeTypes: string[];
}

export const Filters = ({ onChange, onClick, filters, nodeTypes }: FiltersProps) => {
    return (
        <div className="Filters">
            {Object.keys(filters).map(filter => filter === 'type' ?
                (nodeTypes && <SelectFilter key="type" nodeTypes={nodeTypes} onChange={onChange('type')} value={filters.type}/>) :
                <Filter key={filter} type={filter} value={filters[filter]} onChange={onChange(filter)} />
            )}
            <button className="waves-effect waves-light btn" onClick={() => onClick(filters)}>Apply</button>
        </div>
    )
};

const { filters: { updateFilter, submitFilters } } = actions;
export default connect(
    ({ filters, samples, heap: { nodeTypes } }) => { return { filters, samples, nodeTypes } },
    null,
    (stateProps, dispatchProps:any) => {
        const { filters, samples } = stateProps;
        const { dispatch } = dispatchProps;
        return {
            ...stateProps,
            onChange: (type: string): any => (ev: ChangeEvent<HTMLInputElement>): any => {
                //Special case for type select because it comes
                // through as a string
                const value = type === 'type' ?
                    ev.target.value :
                    parseInt(ev.target.value, 10) || '';

                return dispatch(updateFilter({
                    value, type
                }))
            },
            onClick: (filters: FilterState) => dispatch(submitFilters({ filters, samples }))
        }
    }
)(Filters);
