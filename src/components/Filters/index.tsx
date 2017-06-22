import * as React from 'react';
import { EventHandler, MouseEvent, ChangeEvent } from 'react';
import './Filters.pcss';
import Filter from '../Filter';
import SelectFilter from '../Filter';
import { connect } from 'react-redux';
import { actions, FilterState } from '../../services/filters/state';

interface FiltersProps {
    onChange: Function;
    onClick: Function;
    filters: FilterState;
    nodeTypes: string[];
}

export const Filters = ({ onChange, onClick, filters, nodeTypes }: FiltersProps) => {
    return (
        <div className="Filters">
            {Object.keys(filters).map(filter => filter === 'type' ?
                    null
                    :
                <Filter key={filter} type={filter} value={filters[filter]} onChange={onChange(filter)} />
            )}
            <button className="waves-effect waves-light btn" onClick={() => onClick(filters)}>Apply</button>
        </div>
    )
};

const { filters: { updateFilter, submitFilters } } = actions;
export default connect(
    ({filters, heap:{nodeTypes}}) => {return {filters, nodeTypes}},
    dispatch => {
        return {
            onChange: (type: string) => (ev: ChangeEvent<HTMLInputElement>) => {
                const value = ev.target.value;
                return dispatch(updateFilter({
                    value, type
                }))
            },
            onClick: (filters: FilterState) => dispatch(submitFilters(filters))
        }
    }
)(Filters);
