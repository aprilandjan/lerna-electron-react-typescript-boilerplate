/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    /** development or production */
    NODE_ENV: string;
    /** version field in current package.json */
    APP_VERSION: string;
    /** name field in current package.json */
    APP_NAME: string;
  }

  interface Global {
    //
  }
}
