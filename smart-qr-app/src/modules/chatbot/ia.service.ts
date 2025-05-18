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

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.choices[0]?.message?.content || '[]';

    try {
      return JSON.parse(content);
    } catch (err) {
      console.error('Error al parsear la respuesta de la IA:', content);
      return [];
    }
  }
}
