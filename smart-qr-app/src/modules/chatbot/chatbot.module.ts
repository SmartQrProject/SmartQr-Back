import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { IaService } from './ia.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  providers: [ChatbotService, IaService],
  exports: [ChatbotService],
})
export class ChatbotModule {}
