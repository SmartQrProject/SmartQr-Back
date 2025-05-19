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
    const prompt = `Estás actuando como un analizador de intenciones para un chatbot gastronómico. Tu tarea es extraer palabras clave o intenciones relacionadas con comida, salud, dieta, ingredientes o preferencias del usuario a partir de su mensaje.

Tenés que devolver una lista en formato JSON con conceptos clave detectados. Detectá la intención incluso si el usuario usa:

- Lenguaje informal o coloquial
- Errores de escritura menores
- Idiomas mixtos (ej: 'sugar free', 'sin azúcar')
- Expresiones equivalentes o sinónimos

📌 Ejemplos de equivalencias esperadas:

- "sin azúcar", "sugar free", "bajo en azúcar", "no azúcar" → "sin azúcar"
- "sin gluten", "gluten free", "celíaco", "libre de gluten" → "sin gluten"
- "vegano", "vegan", "sin productos animales" → "vegano"
- "vegetariano", "vegetarian", "no carne" → "vegetariano"
- "sin lactosa", "lactose free", "intolerancia a la lactosa" → "sin lactosa"
- "saludable", "light", "fitness", "comida sana" → "saludable"
- "keto", "cetogénico", "pocos carbohidratos" → "keto"
- "proteico", "con proteínas", "alto en proteínas" → "proteico"

📤 Si no detectás ninguna intención relacionada con preferencias alimenticias, ingredientes o dieta, devolvé un array vacío: []

🧾 Mensaje del usuario:
"${userMessage}"

Respondé solo con el array en formato JSON, sin explicaciones ni texto adicional.
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
