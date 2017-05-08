declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "worker-loader!../../worker" {
  const content: any;
  export = content;
}