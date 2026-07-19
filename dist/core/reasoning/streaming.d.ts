import type { StreamEvent } from '../../shared/types/agent.js';
export type StreamCallback = (event: StreamEvent) => void | Promise<void>;
export interface StreamingOptions {
    onThought?: StreamCallback;
    onAction?: StreamCallback;
    onOutput?: StreamCallback;
    onError?: StreamCallback;
    onDone?: StreamCallback;
}
export declare class ReasoningStream {
    private callbacks;
    private enabled;
    constructor(callbacks?: StreamingOptions, enabled?: boolean);
    emit(type: StreamEvent['type'], data: unknown): Promise<void>;
    streamThoughts(thoughts: string[]): AsyncGenerator<StreamEvent>;
    streamActions(actions: string[]): AsyncGenerator<StreamEvent>;
    streamOutput(chunks: string[]): AsyncGenerator<StreamEvent>;
    disable(): void;
    enable(): void;
}
export declare const createReasoningStream: (callbacks: StreamingOptions) => ReasoningStream;
//# sourceMappingURL=streaming.d.ts.map