// WebSocket Events
import type { StreamEvent } from '../../shared/types/agent.js';

export interface WebSocketServerEvents {
  // Connection events
  CONNECT: 'connect';
  DISCONNECT: 'disconnect';

  // Message events
  MESSAGE: 'message';
  ERROR: 'error';

  // Agent events
  EXECUTION_START: 'execution:start';
  EXECUTION_END: 'execution:end';
  EXECUTION_ERROR: 'execution:error';

  // Stream events
  STREAM_THOUGHT: 'stream:thought';
  STREAM_ACTION: 'stream:action';
  STREAM_OUTPUT: 'stream:output';
  STREAM_ERROR: 'stream:error';
  STREAM_DONE: 'stream:done';

  // Room events
  JOIN_ROOM: 'room:join';
  LEAVE_ROOM: 'room:leave';
}

export const WS_EVENTS: WebSocketServerEvents = {
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

export function createExecutionStartEvent(payload: ExecutionStartPayload) {
  return {
    type: WS_EVENTS.EXECUTION_START,
    payload,
  };
}

export function createExecutionEndEvent(payload: ExecutionEndPayload) {
  return {
    type: WS_EVENTS.EXECUTION_END,
    payload,
  };
}

export function createStreamEvent(executionId: string, event: StreamEvent) {
  return {
    type: `stream:${event.type}`,
    payload: { executionId, event },
  };
}
