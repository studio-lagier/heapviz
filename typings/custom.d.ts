declare module '*.svg' {
  const content: any;
  export default content;
}

declare module 'worker-loader!*' {
  const content: any;
  export = content;
}

declare module 'redux-worker-middleware' {
  const createWorkerMiddleware: Function;
  export default createWorkerMiddleware;
}

declare module 'glslify*' {
  export const glslify: any;
}

declare module 'gl-*' {
  const content: any;
  export = content;
}

declare module 'raw!*' {
  const content: any;
  export = content;
}

declare var $: any