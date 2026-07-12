declare module '*.ttf' {
  const content: string;
  export default content;
}

declare global {
  interface NodeRequire {
    context(path: string, deep?: boolean, filter?: RegExp): {
      keys(): string[];
      (id: string): any;
      resolve(id: string): string;
      id: string;
    };
  }
}

export {};