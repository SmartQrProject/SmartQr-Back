import { Module } from '@nestjs/common';
import { ChatbotGateway } from './chatbot.gateway';
import { ChatbotService } from './chatbot.service';
import { UserSessionService } from './user-session/user-session.service';

@Module({
  providers: [ChatbotGateway, ChatbotService, UserSessionService]
})
export class ChatbotModule {}
