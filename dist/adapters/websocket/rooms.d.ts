export interface Room {
    id: string;
    name: string;
    members: Set<string>;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}
export declare class RoomManager {
    private rooms;
    private clientRooms;
    create(id: string, name: string, metadata?: Record<string, unknown>): Room;
    delete(id: string): boolean;
    join(roomId: string, clientId: string): boolean;
    leave(roomId: string, clientId: string): boolean;
    get(roomId: string): Room | undefined;
    list(): Room[];
    getClientRooms(clientId: string): string[];
    getRoomMembers(roomId: string): string[];
    broadcast(roomId: string, message: unknown, exclude?: string[]): void;
}
export declare const roomManager: RoomManager;
//# sourceMappingURL=rooms.d.ts.map