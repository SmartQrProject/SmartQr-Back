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
    type SearchEntry = {
      product: string;
      detail: string;
    };

    const allProducts = await this.productService.findAll('eli-cafe', 1, 999);
    const allDetails: SearchEntry[] = allProducts.products.flatMap((p) =>
      (p.details || []).map((d) => ({
        product: p.name,
        detail: d,
      })),
    );

    const matches = await this.iaService.matchWithAI(message, allDetails);

    if (matches.length === 0) {
      return 'No encontré opciones relacionadas con tu consulta. ¿Querés reformularla?';
    }

    const foundProducts = [...new Set(matches.map((m) => m.product))];

    return `Te puedo recomendar: ${foundProducts.join(', ')}`;
  }
}
