import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import './FileUploadWindow.pcss';
import { RouteComponentProps } from 'react-router';
import { FSA } from '../../../typings/fsa';
import { actions } from '../../services/file/state';
import { Header } from '../Header';
import { resetCache } from '../../services/canvasCache';
const { file: { fetchLocalFile } } = actions;

interface FileUploadWindowProps {
  onClick: (size: string) => FSA;
  fetching: boolean;
}

export class FileUploadWindow extends React.Component<FileUploadWindowProps, {}> {
  componentDidMount() {
    resetCache();
  }

  render() {
    const { onClick, fetching } = this.props;
    return (
      <div className="page">
        <Header />
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
            {fetching ? "Loading profile!" : null}
            <div>
              <a onClick={() => onClick('small')}>(small)</a> |
            <a onClick={() => onClick('medium')}>(medium)</a> |
            <a onClick={() => onClick('large')}>(large)</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function loadStaticFile(size: string) {
  switch (size) {
    case 'small':
      return fetchLocalFile('Heap-20161109T212710.heaptimeline');
    case 'medium':
      return fetchLocalFile('Heap-20170129T011211.heaptimeline');
    case 'large':
      return fetchLocalFile('Heap-20161110T224559.heaptimeline');
  }
}

export default connect(
  ({ file: { fetching } }) => { return { fetching } },
  dispatch => {
    return {
      onClick: size => {
        dispatch(loadStaticFile(size))
      }
    }
  }
)(FileUploadWindow);
