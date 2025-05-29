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
    const prompt = `You are acting as an intent analyzer for a food-related chatbot. Your task is to extract keywords or intents related to food, health, diet, ingredients, or user preferences from their message.

You must return a JSON-formatted list containing the detected key concepts. Detect intent even if the user uses:

- Informal or colloquial language
- Minor spelling errors
- Mixed languages (e.g., 'sugar free', 'sin azúcar')
- Equivalent expressions or synonyms

📌 Examples of expected equivalences:

- "sin azúcar", "sugar free", "low sugar", "no sugar" → "sin azúcar"
- "sin gluten", "gluten free", "celiac", "gluten-free" → "sin gluten"
- "vegano", "vegan", "no animal products" → "vegano"
- "vegetariano", "vegetarian", "no meat" → "vegetariano"
- "sin lactosa", "lactose free", "lactose intolerant" → "sin lactosa"
- "saludable", "light", "fitness", "healthy food" → "saludable"
- "keto", "ketogenic", "low carb" → "keto"
- "proteico", "high in protein", "with protein", "protein-rich" → "proteico"

📤 If no intent related to dietary preferences, ingredients, or diet is detected, return an empty array: []

🧾 User message:
"${userMessage}"

Respond only with the array in JSON format, without any additional explanation or text.
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
        const fallback = ['🧠 The system is temporarily out of service due to usage limits. Please try again later.'];
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
I have the following product details:

${JSON.stringify(
  allDetails.map((d, i) => ({ id: i, ...d })),
  null,
  2,
)}

And this message from the user:

"${userMessage}"

Tell me the IDs of the details that are related to the user's intent. If the message is not related to food, diet, or ingredients, return []. Respond only with an array of IDs.
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
