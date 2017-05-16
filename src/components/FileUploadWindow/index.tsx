import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import './FileUploadWindow.pcss';
import { RouteComponentProps } from 'react-router';
import { FSA } from '../../../typings/fsa';

interface FileUploadWindowProps {
  onClick: (size: string) => FSA
}

export const FileUploadWindow = ({ onClick }: FileUploadWindowProps) => (
  <div className="file-upload-window">
    <div className="instruction-text">
      <div>
        Drag a heap profile here to upload
      </div>
      <div>
        <a href="https://developers.google.com/web/tools/chrome-devtools/memory-problems/allocation-profiler" target="_blank">(Instructions for how to create a heap or allocation profile)</a>
      </div>
      <div>
        or
      </div>
      <div>
        Choose a pre-generated heap profile below
      </div>
      <div>
        <a onClick={() => onClick('small')}>(small)</a> |
        <a>(medium)</a> |
        <a>(large)</a>
      </div>
    </div>
  </div>
);

function loadStaticFile(size: string) {
  switch (size) {
    case 'small':
    case 'medium':
    case 'large':
  }
}

export default connect(
  state => state,
  dispatch => {
    return {
      onClick: size => {
        dispatch(loadStaticFile(size))
      }
    }
  }
)(FileUploadWindow);
