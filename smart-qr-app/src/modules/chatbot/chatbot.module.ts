import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { IntentService } from './intent.service';
import { MenuFaqService } from './menu-faq.service';

@Module({
  providers: [ChatbotService, IntentService, MenuFaqService],
  exports: [ChatbotService],
})
export class ChatbotModule {}
