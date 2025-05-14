import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatbotService } from './chatbot.service';
import { CHATBOT_EVENTS } from './types/chatbot-events';
import { UserSessionService } from './user-session/user-session.service';

@WebSocketGateway({ cors: true })
export class ChatbotGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private chatbotService: ChatbotService,
    private sessionService: UserSessionService,
  ) {}

  handleConnection(client: Socket) {
    const userId = (client.handshake.query.userId as string) || client.id;
    const roomId = this.sessionService.assignUser(client.id, userId);
    client.join(roomId);

    console.log(
      `Cliente ${client.id} conectado como ${userId}, sala: ${roomId}`,
    );
  }

  handleDisconnect(client: Socket) {
    this.sessionService.removeUser(client.id);
    console.log(`Cliente ${client.id} desconectado`);
  }

  @SubscribeMessage(CHATBOT_EVENTS.USER_MESSAGE)
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.sessionService.getUserId(client.id);
    if (!userId) {
      console.warn(
        `Socket ${client?.id ?? 'unknown'} no tiene userId asignado`,
      );
      return;
    }

    const roomId = this.sessionService.getRoomByUserId(userId);
    const reply = this.chatbotService.generateReply(message);
    //   // Emitir la respuesta solo a la sala del usuario.
    this.server.to(roomId).emit(CHATBOT_EVENTS.BOT_REPLY, reply);
  }
}
