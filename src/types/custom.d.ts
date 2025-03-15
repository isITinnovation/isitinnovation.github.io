declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.css" {
  const content: { [key: string]: string };
  export default content;
}

declare module "*.jpg";
declare module "*.png";
declare module "*.svg";
