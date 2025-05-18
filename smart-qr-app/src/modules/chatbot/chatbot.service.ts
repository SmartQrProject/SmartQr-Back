import { Injectable } from '@nestjs/common';
import { IaService } from './ia.service';
import { matchSorter } from 'match-sorter';
import { ProductsService } from '../products/products.service'; // O donde estén tus productos

@Injectable()
export class ChatbotService {
  constructor(
    private readonly iaService: IaService,
    private readonly productService: ProductsService, // ejemplo
  ) {}

  async generateReply(message: string): Promise<string> {
    const intents = await this.iaService.extractIntents(message);

    type SearchEntry = {
      product: string;
      detail: string;
    };

    const allProducts = await this.productService.findAll('eli-cafe', 1, 999); // cada uno con product.details: string[]
    const allDetails: SearchEntry[] = allProducts.products.flatMap((p) => p.details.map((d) => ({ product: p.name, detail: d })));

    const matches = matchSorter(allDetails, intents.join(' '), {
      keys: ['detail'],
    });

    if (matches.length === 0) {
      return 'No encontré opciones relacionadas con tu consulta. ¿Querés reformularla?';
    }

    const foundProducts = [...new Set(matches.map((m) => m.product))];

    return `Te puedo recomendar: ${foundProducts.join(', ')}`;
  }
}
