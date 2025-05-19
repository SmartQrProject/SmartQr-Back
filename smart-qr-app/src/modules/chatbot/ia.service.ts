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
Dado este mensaje de un usuario: "${userMessage}", generá una lista con las posibles palabras clave o intenciones relacionadas con alimentos, salud, preferencias dietéticas, ingredientes, etc.

Ejemplo de salida para "plato vegano":
["vegano", "vegetal", "sin productos animales", "dieta vegana"]

Si el mensaje no tiene ninguna intención útil (por ejemplo, si solo dice "hola", "cómo estás", etc), devolvé un array vacío: [].

Devolvé solo el array en formato JSON.
    `;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });

      const raw = completion.choices[0].message.content || '[]';
      const parsed = JSON.parse(raw);
      console.log('🧠 Intents detectados:', parsed);

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

Decime los IDs de los detalles que están relacionados con la intención del usuario. Si el mensaje no tiene relación con comida, dieta o ingredientes, devolvé []. Respondé solo con un array de IDs.
`;

    try {
      console.log('📤 Enviando prompt a OpenAI...');
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });

      const content = completion.choices[0].message.content || '[]';
      console.log('🧠 Respuesta cruda de OpenAI:', content);

      const matchedIds: number[] = JSON.parse(content);
      console.log('🎯 IDs detectados por OpenAI:', matchedIds);

      const result = matchedIds.map((id) => allDetails[id]).filter(Boolean);
      console.log('✅ Detalles encontrados:', result);

      return result;
    } catch (error) {
      console.error('❌ Error en matchWithAI:', error);
      return [];
    }
  }
}
