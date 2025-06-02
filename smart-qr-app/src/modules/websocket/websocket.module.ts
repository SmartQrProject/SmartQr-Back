import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatbotService } from '../chatbot/chatbot.service';
import { UserSessionService } from './user-session/user-session.service';
import { ChatbotModule } from '../chatbot/chatbot.module';

@Module({
  imports: [ChatbotModule],
  providers: [ChatGateway, UserSessionService],
})
export class WebSocketModule {}
