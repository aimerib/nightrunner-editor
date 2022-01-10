/// <reference types="react" />

// declare module '*.module.css' {
//   const classes: { readonly [key: string]: string };
//   export default classes;
// }

// declare module '*.css' {
//   interface IClassNames {
//     [className: string]: string
//   }
//   const classNames: IClassNames
//   export = classNames;
// }

declare module '*.css' {
  const content: { [className: string]: string };
  export = content;
}
