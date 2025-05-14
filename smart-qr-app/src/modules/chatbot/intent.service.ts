import { Injectable } from '@nestjs/common';

export type IntentType = 'VEGAN' | 'GLUTEN' | 'UNKNOWN';

@Injectable()
export class IntentService {
  detectIntent(message: string): IntentType {
    const msg = message.toLowerCase();

    if (msg.includes('vegano') || msg.includes('vegana')) return 'VEGAN';
    if (msg.includes('gluten')) return 'GLUTEN';

    return 'UNKNOWN';
  }
}
