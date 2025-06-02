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
    const prompt = `You are an expert intent and keyword extractor for a food-related chatbot. Your task is to analyze the user's message and extract all relevant **dietary intents or food-related preferences**, using semantic understanding.

Return a JSON array of **standardized key intents or concepts**, such as diet types, ingredient exclusions, nutritional goals, or health preferences.

✅ Your output must:
- Include all relevant keywords or concepts found in the message, not just the most obvious one.
- Normalize different ways of expressing the same idea (synonyms, slang, abbreviations, partial words).
- Handle informal writing, spelling mistakes, emojis, and mixed language (e.g., English & Spanish).
- Include **multiple concepts** if more than one intent is mentioned.

🎯 Normalize to the following kinds of intents (non-exhaustive, examples only):
- "sin azúcar", "sugar free", "no sugar", "low sugar", "sin azucar", "cero azúcar" → **"sin azúcar"**
- "sin gluten", "gluten free", "celiac", "gluten-free" → **"sin gluten"**
- "vegano", "vegan", "no animal products", "plant based", "🌱" → **"vegano"**
- "vegetariano", "vegetarian", "no meat", "semi-veg" → **"vegetariano"**
- "sin lactosa", "lactose free", "no dairy", "lactose intolerant" → **"sin lactosa"**
- "saludable", "healthy", "light", "fit", "fitness", "comida sana" → **"saludable"**
- "keto", "ketogenic", "low carb", "dieta cetogénica" → **"keto"**
- "proteico", "high protein", "protein-rich", "más proteína" → **"proteico"**

📤 If no relevant dietary intent or concept is found, return an empty array: []

🧾 User message:
"${userMessage}"

Return only the JSON array with all relevant standardized concepts. Do not add any explanation or extra text.`;

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
