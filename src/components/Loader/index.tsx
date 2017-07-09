import * as React from 'react';
import './Loader.pcss';

interface LoaderProps {
    visible: boolean;
    message: string;
}

export const Loader = ({ visible, message }: LoaderProps) => (
    <div className={`Loader ${visible ? 'visible' : ''}`}>
        <ul className="LoaderImage">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
        <div className="text">{message}</div>
    </div>
);

export default Loader;
