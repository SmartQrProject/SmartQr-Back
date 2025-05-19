import { Injectable } from '@nestjs/common';
import { IaService } from './ia.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ChatbotService {
  constructor(
    private readonly iaService: IaService,
    private readonly productService: ProductsService,
  ) {}

  async generateReply(message: string): Promise<string> {
    console.log('📥 Mensaje del usuario:', message);

    type SearchEntry = {
      product: string;
      detail: string;
    };

    const intents = await this.iaService.extractIntents(message);
    console.log('🔎 Intenciones detectadas:', intents);

    if (!intents || intents.length === 0) {
      const fallback = '👋 ¡Hola! ¿Qué estás buscando? Podés decir cosas como "sin azúcar", "vegano", "sin gluten", etc.';
      console.log('📭 Respuesta final (sin intención):', fallback);
      return fallback;
    }

    const allProducts = await this.productService.findAll('eli-cafe', 1, 999);
    console.log('📦 Productos obtenidos:', allProducts.products.length);

    const allDetails: SearchEntry[] = allProducts.products.flatMap((p) =>
      (p.details || []).map((d) => ({
        product: p.name,
        detail: d,
      })),
    );
    console.log('🔍 Detalles generados:', allDetails);

    const matches = await this.iaService.matchWithAI(message, allDetails);
    console.log('🤖 Matches obtenidos:', matches);

    if (matches.length === 0) {
      const response = 'No encontré opciones relacionadas con tu consulta. ¿Querés reformularla?';
      console.log('📭 Respuesta final (sin matches):', response);
      return response;
    }

    const foundProducts = [...new Set(matches.map((m) => m.product))];
    console.log('📋 Productos recomendados:', foundProducts);

    const response = `Te puedo recomendar: ${foundProducts.join(', ')}`;
    console.log('📤 Respuesta final:', response);
    return response;
  }
}
