// WebSocket Client
import { createLogger } from '../../shared/utils/logger.js';
const logger = createLogger('adapters:websocket:client');
export class WebSocketClient {
    connections = new Map();
    listeners = new Map();
    addClient(id, socket) {
        this.connections.set(id, socket);
        socket.on('message', (data) => this.handleMessage(id, data));
        socket.on('close', () => this.handleClose(id));
        socket.on('error', (error) => this.handleError(id, error));
        logger.info({ clientId: id }, 'WebSocket client connected');
    }
    removeClient(id) {
        const socket = this.connections.get(id);
        if (socket) {
            socket.close();
            this.connections.delete(id);
            logger.info({ clientId: id }, 'WebSocket client disconnected');
        }
    }
    send(clientId, message) {
        const socket = this.connections.get(clientId);
        if (!socket) {
            logger.warn({ clientId }, 'Client not found');
            return false;
        }
        try {
            socket.send(JSON.stringify(message));
            return true;
        }
        catch (error) {
            logger.error({ clientId, error }, 'Failed to send message');
            return false;
        }
    }
    broadcast(message, exclude) {
        for (const [id] of this.connections) {
            if (exclude?.includes(id))
                continue;
            this.send(id, message);
        }
    }
    sendStreamEvent(clientId, event) {
        return this.send(clientId, {
            type: 'stream',
            payload: event,
        });
    }
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
    }
    off(event, callback) {
        this.listeners.get(event)?.delete(callback);
    }
    handleMessage(clientId, data) {
        const callbacks = this.listeners.get('message');
        if (callbacks) {
            for (const callback of callbacks) {
                callback({ clientId, data });
            }
        }
    }
    handleClose(clientId) {
        this.removeClient(clientId);
        const callbacks = this.listeners.get('disconnection');
        if (callbacks) {
            for (const callback of callbacks) {
                callback({ clientId });
            }
        }
    }
    handleError(clientId, error) {
        logger.error({ clientId, error }, 'WebSocket error');
        const callbacks = this.listeners.get('error');
        if (callbacks) {
            for (const callback of callbacks) {
                callback({ clientId, error });
            }
        }
    }
    getClientCount() {
        return this.connections.size;
    }
    getClientIds() {
        return [...this.connections.keys()];
    }
}
export const wsClient = new WebSocketClient();
//# sourceMappingURL=client.js.map