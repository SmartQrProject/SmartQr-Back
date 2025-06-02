import { Injectable } from '@nestjs/common';

@Injectable()
export class UserSessionService {
  // socketId → userId
  private socketToUser = new Map<string, string>();
  // userId → roomId (útil si después querés usar room personalizada)
  private userToRoom = new Map<string, string>();

  assignUser(socketId: string, userId: string) {
    const roomId = `room_${userId}`;
    this.socketToUser.set(socketId, userId);
    this.userToRoom.set(userId, roomId);
    return roomId;
  }

  removeUser(socketId: string) {
    const userId = this.socketToUser.get(socketId);
    if (userId) {
      this.socketToUser.delete(socketId);
      this.userToRoom.delete(userId);
    }
  }

  getUserId(socketId: string): string | undefined {
    return this.socketToUser.get(socketId);
  }

  getRoomByUserId(userId: string): string {
    return this.userToRoom.get(userId) ?? `room_${userId}`;
  }
}
