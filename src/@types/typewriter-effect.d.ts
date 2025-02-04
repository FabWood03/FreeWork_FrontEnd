// typings.d.ts
declare module 'typewriter-effect/dist/core' {
  export interface TypewriterOptions {
    strings?: string | string[];
    cursor?: string;
    delay?: number;
    deleteSpeed?: number;
    loop?: boolean;
    autoStart?: boolean;
    devMode?: boolean;
    wrapperClassName?: string;
    cursorClassName?: string;
  }

  export default class Typewriter {
    constructor(element: HTMLElement, options?: TypewriterOptions);

    typeString(string: string): this;
    pauseFor(ms: number): this;
    deleteAll(speed?: number): this;
    deleteChars(amount: number): this;
    callFunction(callback: () => void): this;
    start(): void;
    stop(): void;
    restart(): void;
  }
}
