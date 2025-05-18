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
      console.log('🤖 Respuesta de OpenAI:', completion);
      const raw = completion.choices[0].message.content || '[]';
      console.log('🧠 Respuesta cruda de OpenAI:', raw);
      const parsed = JSON.parse(raw);
      console.log('🧠 Intents generados:', parsed);

      return parsed;
    } catch (error: any) {
      console.error('❌ Error en extractIntents:', error);

      if (error.code === 'insufficient_quota') {
        const fallback = ['🧠 El sistema está temporalmente fuera de servicio por límite de uso. Intentá más tarde.'];
        console.log('⚠️ Intents fallback por límite:', fallback);
        return fallback;
      }

      const fallback = ['❌ Error al generar intents.'];
      console.log('⚠️ Intents fallback general:', fallback);
      return fallback;
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
    console.log('🧠 Prompt para OpenAI:', prompt);
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });
      console.log('🤖 Respuesta de OpenAI:', completion);
      const content = completion.choices[0].message.content || '[]';
      console.log('🧠 Respuesta cruda de OpenAI:', content);
      const matchedIds: number[] = JSON.parse(content);
      console.log('🎯 IDs detectados por OpenAI:', matchedIds);

      const result = matchedIds.map((id) => allDetails[id]).filter(Boolean);
      console.log('✅ Detalles encontrados:', result);

      return result;
    } catch (error) {
      console.error('❌ Error en matchWithAI:', error);
      const fallback: { product: string; detail: string }[] = [];
      console.log('⚠️ Resultado fallback matchWithAI:', fallback);
      return fallback;
    }
  }
}
