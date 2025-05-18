import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { IaService } from './ia.service';

@Module({
  providers: [ChatbotService, IaService],
  exports: [ChatbotService],
})
export class ChatbotModule {}
