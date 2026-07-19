// Streaming Support for Reasoning
import { createLogger } from '../../shared/utils/logger.js';
import type { StreamEvent } from '../../shared/types/agent.js';

const logger = createLogger('reasoning:streaming');

export type StreamCallback = (event: StreamEvent) => void | Promise<void>;

export interface StreamingOptions {
  onThought?: StreamCallback;
  onAction?: StreamCallback;
  onOutput?: StreamCallback;
  onError?: StreamCallback;
  onDone?: StreamCallback;
}

export class ReasoningStream {
  private callbacks: StreamingOptions;
  private enabled: boolean;

  constructor(callbacks: StreamingOptions = {}, enabled = true) {
    this.callbacks = callbacks;
    this.enabled = enabled;
  }

  async emit(type: StreamEvent['type'], data: unknown): Promise<void> {
    if (!this.enabled) return;

    const event: StreamEvent = {
      type,
      data,
      timestamp: Date.now(),
    };

    try {
      switch (type) {
        case 'thought':
          await this.callbacks.onThought?.(event);
          break;
        case 'action':
          await this.callbacks.onAction?.(event);
          break;
        case 'output':
          await this.callbacks.onOutput?.(event);
          break;
        case 'error':
          await this.callbacks.onError?.(event);
          break;
        case 'done':
          await this.callbacks.onDone?.(event);
          break;
      }
    } catch (error) {
      logger.error({ error }, 'Error in stream callback');
    }
  }

  async *streamThoughts(thoughts: string[]): AsyncGenerator<StreamEvent> {
    for (const thought of thoughts) {
      const event: StreamEvent = {
        type: 'thought',
        data: { content: thought },
        timestamp: Date.now(),
      };
      await this.emit('thought', { content: thought });
      yield event;
    }
  }

  async *streamActions(actions: string[]): AsyncGenerator<StreamEvent> {
    for (const action of actions) {
      const event: StreamEvent = {
        type: 'action',
        data: { content: action },
        timestamp: Date.now(),
      };
      await this.emit('action', { content: action });
      yield event;
    }
  }

  async *streamOutput(chunks: string[]): AsyncGenerator<StreamEvent> {
    let fullOutput = '';
    for (const chunk of chunks) {
      fullOutput += chunk;
      const event: StreamEvent = {
        type: 'output',
        data: { content: chunk, fullOutput },
        timestamp: Date.now(),
      };
      await this.emit('output', { content: chunk, fullOutput });
      yield event;
    }
  }

  disable(): void {
    this.enabled = false;
  }

  enable(): void {
    this.enabled = true;
  }
}

export const createReasoningStream = (callbacks: StreamingOptions) => {
  return new ReasoningStream(callbacks);
};
