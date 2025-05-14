import { Injectable } from '@nestjs/common';
import { IntentType } from './intent.service';

@Injectable()
export class MenuFaqService {
  getResponseByIntent(intent: IntentType): string {
    switch (intent) {
      case 'VEGAN':
        return 'Opciones veganas: ensalada, hummus, wrap de tofu.';
      case 'GLUTEN':
        return 'Opciones sin gluten: tortilla de papa, arroz con verduras.';
      default:
        return 'No entendí tu consulta. ¿Podés reformularla?';
    }
  }
}
