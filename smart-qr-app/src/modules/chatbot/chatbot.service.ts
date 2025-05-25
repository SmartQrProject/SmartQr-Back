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
    const cleaned = message
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .trim();

    console.log('📥 Mensaje del usuario:', cleaned);

    type SearchEntry = {
      product: string;
      detail: string;
    };

    const intents = await this.iaService.extractIntents(cleaned);
    console.log('🔎 Intenciones detectadas:', intents);

    if (!intents || intents.length === 0) {
      const fallback = '👋 Hello! What are you looking for? You can say things like "sugar-free", "vegan", "gluten-free", etc.';
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
      const response = 'Sorry, I couldn´t find any options matching your request. Would you like to try rephrasing it?';
      console.log('📭 Respuesta final (sin matches):', response);
      return response;
    }

    const foundProducts = [...new Set(matches.map((m) => m.product))];
    console.log('📋 Productos recomendados:', foundProducts);

    const response = `Here are some recommendations: ${foundProducts.join(', ')}`;
    console.log('📤 Respuesta final:', response);
    return response;
  }
}
