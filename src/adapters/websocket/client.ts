// WebSocket Client
import { createLogger } from '../../shared/utils/logger.js';
import type { StreamEvent } from '../../shared/types/agent.js';

const logger = createLogger('adapters:websocket:client');

export type WebSocketEvent = 
  | 'connection'
  | 'disconnection'
  | 'message'
  | 'error';

export interface WebSocketMessage {
  type: string;
  payload: unknown;
  id?: string;
}

export class WebSocketClient {
  private connections: Map<string, WebSocket> = new Map();
  private listeners: Map<string, Set<(data: unknown) => void>> = new Map();

  addClient(id: string, socket: WebSocket): void {
    this.connections.set(id, socket);
    socket.on('message', (data) => this.handleMessage(id, data));
    socket.on('close', () => this.handleClose(id));
    socket.on('error', (error) => this.handleError(id, error));
    logger.info({ clientId: id }, 'WebSocket client connected');
  }

  removeClient(id: string): void {
    const socket = this.connections.get(id);
    if (socket) {
      socket.close();
      this.connections.delete(id);
      logger.info({ clientId: id }, 'WebSocket client disconnected');
    }
  }

  send(clientId: string, message: WebSocketMessage): boolean {
    const socket = this.connections.get(clientId);
    if (!socket) {
      logger.warn({ clientId }, 'Client not found');
      return false;
    }

    try {
      socket.send(JSON.stringify(message));
      return true;
    } catch (error) {
      logger.error({ clientId, error }, 'Failed to send message');
      return false;
    }
  }

  broadcast(message: WebSocketMessage, exclude?: string[]): void {
    for (const [id, socket] of this.connections) {
      if (exclude?.includes(id)) continue;
      this.send(id, message);
    }
  }

  sendStreamEvent(clientId: string, event: StreamEvent): boolean {
    return this.send(clientId, {
      type: 'stream',
      payload: event,
    });
  }

  on(event: WebSocketEvent, callback: (data: unknown) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: WebSocketEvent, callback: (data: unknown) => void): void {
    this.listeners.get(event)?.delete(callback);
  }

  private handleMessage(clientId: string, data: unknown): void {
    const callbacks = this.listeners.get('message');
    if (callbacks) {
      for (const callback of callbacks) {
        callback({ clientId, data });
      }
    }
  }

  private handleClose(clientId: string): void {
    this.removeClient(clientId);
    const callbacks = this.listeners.get('disconnection');
    if (callbacks) {
      for (const callback of callbacks) {
        callback({ clientId });
      }
    }
  }

  private handleError(clientId: string, error: Error): void {
    logger.error({ clientId, error }, 'WebSocket error');
    const callbacks = this.listeners.get('error');
    if (callbacks) {
      for (const callback of callbacks) {
        callback({ clientId, error });
      }
    }
  }

  getClientCount(): number {
    return this.connections.size;
  }

  getClientIds(): string[] {
    return [...this.connections.keys()];
  }
}

export const wsClient = new WebSocketClient();
