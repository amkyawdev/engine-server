import type { StreamEvent } from '../../shared/types/agent.js';
export type WebSocketEvent = 'connection' | 'disconnection' | 'message' | 'error';
export interface WebSocketMessage {
    type: string;
    payload: unknown;
    id?: string;
}
interface WebSocketLike {
    on(event: string, handler: (data?: unknown) => void): void;
    send(data: string): void;
    close(): void;
}
export declare class WebSocketClient {
    private connections;
    private listeners;
    addClient(id: string, socket: WebSocketLike): void;
    removeClient(id: string): void;
    send(clientId: string, message: WebSocketMessage): boolean;
    broadcast(message: WebSocketMessage, exclude?: string[]): void;
    sendStreamEvent(clientId: string, event: StreamEvent): boolean;
    on(event: WebSocketEvent, callback: (data: unknown) => void): void;
    off(event: WebSocketEvent, callback: (data: unknown) => void): void;
    private handleMessage;
    private handleClose;
    private handleError;
    getClientCount(): number;
    getClientIds(): string[];
}
export declare const wsClient: WebSocketClient;
export {};
//# sourceMappingURL=client.d.ts.map