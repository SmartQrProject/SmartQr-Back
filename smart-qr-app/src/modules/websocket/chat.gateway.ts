import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatbotService } from '../chatbot/chatbot.service';
import { CHAT_EVENTS } from './types/chat-events';
import { UserSessionService } from './user-session/user-session.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private chatbotService: ChatbotService,
    private sessionService: UserSessionService,
  ) {}

  handleConnection(client: Socket) {
    const userId = (client.handshake.query.userId as string) || client.id;
    if (!userId) {
      console.warn(`❌ Cliente ${client.id} intentó conectarse sin userId`);
      client.emit('connection_error', 'Falta userId en la conexión');
      client.disconnect();
      return;
    }
    const roomId = this.sessionService.assignUser(client.id, userId);

    client.join(roomId);

    console.log(`Cliente ${client.id} conectado como ${userId}, sala: ${roomId}`);
  }

  handleDisconnect(client: Socket) {
    this.sessionService.removeUser(client.id);
    console.log(`Cliente ${client.id} desconectado`);
  }

  @SubscribeMessage(CHAT_EVENTS.USER_MESSAGE)
  async handleMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket) {
    const userId = this.sessionService.getUserId(client.id);
    if (!userId) {
      console.warn(`Socket ${client?.id ?? 'unknown'} no tiene userId asignado`);
      return;
    }

    const roomId = this.sessionService.getRoomByUserId(userId);
    const reply = await this.chatbotService.generateReply(message); // ✅ AWAIT agregado
    console.log('📤 Respuesta emitida al socket:', reply);

    this.server.to(roomId).emit(CHAT_EVENTS.BOT_REPLY, reply);
  }
}
