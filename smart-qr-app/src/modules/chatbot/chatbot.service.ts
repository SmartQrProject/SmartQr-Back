import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatbotService {
  generateReply(message: string): string {
    const msg = message.toLowerCase();
    if (msg.includes('vegano')) return 'Opciones veganas: Ensalada, Tofu Bowl';
    if (msg.includes('gluten'))
      return 'Tenemos opciones sin gluten: Sopa de maíz, Tortilla de papas';
    return 'No entendí tu consulta. ¿Podés repetirla?';
  }
}
