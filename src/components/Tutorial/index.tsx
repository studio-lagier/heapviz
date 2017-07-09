import * as React from 'react';
import './Tutorial.pcss';

interface TutorialProps {
    start: any
}

export const Tutorial = ({start}:TutorialProps) => (
    <div className="Tutorial module">
        <h3>Confused?</h3>
        <button onClick={start} className="btn waves-effect waves-light">Show tutorial</button>
    </div>
);

export default Tutorial;
