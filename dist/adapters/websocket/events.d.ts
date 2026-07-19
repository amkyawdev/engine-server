import type { StreamEvent } from '../../shared/types/agent.js';
export interface WebSocketServerEvents {
    CONNECT: 'connect';
    DISCONNECT: 'disconnect';
    MESSAGE: 'message';
    ERROR: 'error';
    EXECUTION_START: 'execution:start';
    EXECUTION_END: 'execution:end';
    EXECUTION_ERROR: 'execution:error';
    STREAM_THOUGHT: 'stream:thought';
    STREAM_ACTION: 'stream:action';
    STREAM_OUTPUT: 'stream:output';
    STREAM_ERROR: 'stream:error';
    STREAM_DONE: 'stream:done';
    JOIN_ROOM: 'room:join';
    LEAVE_ROOM: 'room:leave';
}
export declare const WS_EVENTS: WebSocketServerEvents;
export interface ExecutionStartPayload {
    executionId: string;
    input: string;
}
export interface ExecutionEndPayload {
    executionId: string;
    status: 'completed' | 'failed' | 'cancelled';
    output?: string;
    error?: string;
}
export interface StreamPayload {
    executionId: string;
    event: StreamEvent;
}
export declare function createExecutionStartEvent(payload: ExecutionStartPayload): {
    type: "execution:start";
    payload: ExecutionStartPayload;
};
export declare function createExecutionEndEvent(payload: ExecutionEndPayload): {
    type: "execution:end";
    payload: ExecutionEndPayload;
};
export declare function createStreamEvent(executionId: string, event: StreamEvent): {
    type: string;
    payload: {
        executionId: string;
        event: StreamEvent;
    };
};
//# sourceMappingURL=events.d.ts.map