declare module 'nprogress' {
    export interface NProgressOptions {
        minimum?: number;
        template?: string;
        easing?: string;
        speed?: number;
        trickle?: boolean;
        trickleSpeed?: number;
        showSpinner?: boolean;
        parent?: string;
        positionUsing?: string;
        barSelector?: string;
        spinnerSelector?: string;
    }

    export function configure(options: NProgressOptions): void;
    export function set(amount: number): void;
    export function isStarted(): boolean;
    export function start(): void;
    export function done(force?: boolean): void;
    export function inc(amount?: number): void;
    export function trickle(): void;
    export function remove(): void;
    export function status(): number | null;
}