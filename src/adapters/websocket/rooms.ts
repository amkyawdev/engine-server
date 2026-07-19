// WebSocket Rooms
import { createLogger } from '../../shared/utils/logger.js';

const logger = createLogger('adapters:websocket:rooms');

export interface Room {
  id: string;
  name: string;
  members: Set<string>;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export class RoomManager {
  private rooms: Map<string, Room> = new Map();
  private clientRooms: Map<string, Set<string>> = new Map();

  create(id: string, name: string, metadata?: Record<string, unknown>): Room {
    if (this.rooms.has(id)) {
      logger.warn({ roomId: id }, 'Room already exists');
      return this.rooms.get(id)!;
    }

    const room: Room = {
      id,
      name,
      members: new Set(),
      metadata,
      createdAt: new Date(),
    };

    this.rooms.set(id, room);
    logger.info({ roomId: id, name }, 'Room created');

    return room;
  }

  delete(id: string): boolean {
    const room = this.rooms.get(id);
    if (!room) return false;

    // Remove all members from the room
    for (const memberId of room.members) {
      this.leave(id, memberId);
    }

    this.rooms.delete(id);
    logger.info({ roomId: id }, 'Room deleted');

    return true;
  }

  join(roomId: string, clientId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) {
      logger.warn({ roomId }, 'Room not found');
      return false;
    }

    room.members.add(clientId);

    if (!this.clientRooms.has(clientId)) {
      this.clientRooms.set(clientId, new Set());
    }
    this.clientRooms.get(clientId)!.add(roomId);

    logger.debug({ roomId, clientId }, 'Client joined room');

    return true;
  }

  leave(roomId: string, clientId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    room.members.delete(clientId);

    const rooms = this.clientRooms.get(clientId);
    if (rooms) {
      rooms.delete(roomId);
      if (rooms.size === 0) {
        this.clientRooms.delete(clientId);
      }
    }

    logger.debug({ roomId, clientId }, 'Client left room');

    return true;
  }

  get(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  list(): Room[] {
    return [...this.rooms.values()];
  }

  getClientRooms(clientId: string): string[] {
    return [...(this.clientRooms.get(clientId) || [])];
  }

  getRoomMembers(roomId: string): string[] {
    const room = this.rooms.get(roomId);
    return room ? [...room.members] : [];
  }

  broadcast(roomId: string, message: unknown, exclude?: string[]): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    // In production, send to all members via WebSocket
    for (const memberId of room.members) {
      if (exclude?.includes(memberId)) continue;
      // Send message to member
    }
  }
}

export const roomManager = new RoomManager();
