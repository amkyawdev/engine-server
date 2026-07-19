// Streaming Support for Reasoning
import { createLogger } from '../../shared/utils/logger.js';
const logger = createLogger('reasoning:streaming');
export class ReasoningStream {
    callbacks;
    enabled;
    constructor(callbacks = {}, enabled = true) {
        this.callbacks = callbacks;
        this.enabled = enabled;
    }
    async emit(type, data) {
        if (!this.enabled)
            return;
        const event = {
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
        }
        catch (error) {
            logger.error({ error }, 'Error in stream callback');
        }
    }
    async *streamThoughts(thoughts) {
        for (const thought of thoughts) {
            const event = {
                type: 'thought',
                data: { content: thought },
                timestamp: Date.now(),
            };
            await this.emit('thought', { content: thought });
            yield event;
        }
    }
    async *streamActions(actions) {
        for (const action of actions) {
            const event = {
                type: 'action',
                data: { content: action },
                timestamp: Date.now(),
            };
            await this.emit('action', { content: action });
            yield event;
        }
    }
    async *streamOutput(chunks) {
        let fullOutput = '';
        for (const chunk of chunks) {
            fullOutput += chunk;
            const event = {
                type: 'output',
                data: { content: chunk, fullOutput },
                timestamp: Date.now(),
            };
            await this.emit('output', { content: chunk, fullOutput });
            yield event;
        }
    }
    disable() {
        this.enabled = false;
    }
    enable() {
        this.enabled = true;
    }
}
export const createReasoningStream = (callbacks) => {
    return new ReasoningStream(callbacks);
};
//# sourceMappingURL=streaming.js.map