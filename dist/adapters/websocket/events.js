export const WS_EVENTS = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    MESSAGE: 'message',
    ERROR: 'error',
    EXECUTION_START: 'execution:start',
    EXECUTION_END: 'execution:end',
    EXECUTION_ERROR: 'execution:error',
    STREAM_THOUGHT: 'stream:thought',
    STREAM_ACTION: 'stream:action',
    STREAM_OUTPUT: 'stream:output',
    STREAM_ERROR: 'stream:error',
    STREAM_DONE: 'stream:done',
    JOIN_ROOM: 'room:join',
    LEAVE_ROOM: 'room:leave',
};
export function createExecutionStartEvent(payload) {
    return {
        type: WS_EVENTS.EXECUTION_START,
        payload,
    };
}
export function createExecutionEndEvent(payload) {
    return {
        type: WS_EVENTS.EXECUTION_END,
        payload,
    };
}
export function createStreamEvent(executionId, event) {
    return {
        type: `stream:${event.type}`,
        payload: { executionId, event },
    };
}
//# sourceMappingURL=events.js.map