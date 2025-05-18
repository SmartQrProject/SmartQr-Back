import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from 'src/config/env.loader';

@Injectable()
export class IaService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
  }

  async extractIntents(userMessage: string): Promise<string[]> {
    const prompt = `
Dado este mensaje de un usuario: "${userMessage}", generá una lista con las posibles palabras clave o intenciones relacionadas.

Ejemplo de salida para "plato vegano":
["vegano", "vegana", "vegan", "vegetal", "plant-based", "alimentación vegetal", "sin productos animales", "sin carne ni lácteos", "dieta vegana", "comida vegana"]

Devolvé solo el array en formato JSON.
    `;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });

      const raw = completion.choices[0].message.content || '[]';
      return JSON.parse(raw);
    } catch (error: any) {
      if (error.code === 'insufficient_quota') {
        return ['🧠 El sistema está temporalmente fuera de servicio por límite de uso. Intentá más tarde.'];
      }
      return ['❌ Hubo un error al interpretar tu consulta. Por favor, intentá de nuevo.'];
    }
  }

  async matchWithAI(userMessage: string, allDetails: { product: string; detail: string }[]): Promise<{ product: string; detail: string }[]> {
    const prompt = `
Tengo los siguientes detalles de productos:

${JSON.stringify(
  allDetails.map((d, i) => ({ id: i, ...d })),
  null,
  2,
)}

Y este mensaje del usuario:

"${userMessage}"

Decime los IDs de los detalles que están relacionados con la intención del usuario. Respondé solo con un array de IDs.

Ejemplo de respuesta: [0, 3, 5]
`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });

      const content = completion.choices[0].message.content || '[]';
      const matchedIds: number[] = JSON.parse(content);

      return matchedIds.map((id) => allDetails[id]).filter(Boolean); // Evita errores si un id no existe
    } catch (error) {
      console.error('🔴 Error en matchWithAI:', error);
      return [];
    }
  }
}
