import { Injectable } from '@nestjs/common';
import { IntentService } from './intent.service';
import { MenuFaqService } from './menu-faq.service';

@Injectable()
export class ChatbotService {
  constructor(
    private intentService: IntentService,
    private faqService: MenuFaqService,
  ) {}

  generateReply(message: string): string {
    const intent = this.intentService.detectIntent(message);
    return this.faqService.getResponseByIntent(intent);
  }
}
