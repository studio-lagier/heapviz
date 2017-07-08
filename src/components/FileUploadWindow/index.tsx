import * as React from 'react';
import { Component, DragEvent } from 'react';
import { connect } from 'react-redux';
import './FileUploadWindow.pcss';
import { RouteComponentProps } from 'react-router';
import { FSA } from '../../../typings/fsa';
import { actions } from '../../services/file/state';
import { Header } from '../Header';
import { resetCache } from '../../services/canvasCache';
import { actions as modalActions } from '../../services/modal/state';
import { actions as heapActions } from '../../services/heap/state';

const { file: { fetchLocalFile, loadFile, fileLoaded, dragOver, dragOut } } = actions;
const { modal: { showModal } } = modalActions;
const { heap: { transferProfile } } = heapActions;

interface FileUploadWindowProps {
  onClick: (size: string) => FSA;
  onDragOver: (ev: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onDrop: () => void;
  showHelp: () => FSA;
  size: any;
  fetching: boolean;
  dragging: boolean;
}

export class FileUploadWindow extends React.Component<FileUploadWindowProps, {}> {
  componentDidMount() {
    resetCache();
  }

  render() {
    const { onClick, onDragOver, onDragEnd, onDrop, showHelp, fetching, dragging } = this.props;
    return (
      <div className="page">
        <Header />
        <div className={`file-upload-window ${dragging ? 'dragging' : ''}`} onDragOver={onDragOver} onDragLeave={onDragEnd} onDrop={onDrop}>
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
            <button onClick={showHelp}>Show help</button>
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
  ({ file: { fetching, dragging }, renderer: { size } }) => { return { fetching, dragging, size } },
  null,
  (stateProps, dispatchProps: any) => {
    const { size } = stateProps;
    const { dispatch } = dispatchProps;
    return {
      ...stateProps,
      onClick: (size:string) => dispatch(loadStaticFile(size)),
      showHelp: () => dispatch(showModal('help')),
      onDragOver(ev: DragEvent<HTMLDivElement>) {
        ev.stopPropagation();
        ev.preventDefault();
        ev.dataTransfer.dropEffect = 'copy';
        dispatch(dragOver());
      },
      onDragEnd() { dispatch(dragOut())},
      onDrop(ev: DragEvent<HTMLDivElement>) {
        ev.stopPropagation();
        ev.preventDefault();
        const fr = new FileReader();
        const file = ev.dataTransfer.files[0];
        dispatch(loadFile(file.name));
        fr.readAsArrayBuffer(file);
        fr.onloadend = () => {
          dispatch(fileLoaded(fr.result))
          dispatch(transferProfile({
            heap: fr.result,
            width: size * 2
          }));
        };
      }
    }
  }
)(FileUploadWindow);
