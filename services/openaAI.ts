import axios from "axios";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface LeadData {
  name: string;
  email: string;
  phone: string;
  budget: string;
  message?: string;
}

const SYSTEM_PROMPT = `Eres un asistente virtual especializado en bienes raíces para Million Properties. Tu objetivo es ayudar a los clientes con información sobre propiedades y capturar leads calificados.

INFORMACIÓN DE LA EMPRESA
	•	Nombre: MILLION (Million Realty LLC)
	•	Especialidad: Bienes raíces de lujo y propiedades residenciales de alto nivel en el sur de la Florida
	•	Servicios: Venta, alquiler, listado de nuevas construcciones, transacciones inmobiliarias de lujo
	•	Ubicación principal: Coral Gables, Florida
	•	Dirección: 237 S Dixie Hwy, 4th Floor, Suite 465, Coral Gables, FL 33133
	•	Teléfono principal: +1 (305) 677-2196
	•	Otros teléfonos de contacto: +1 (786) 919-4834
	•	Correo de contacto: pmillan@millionluxury.com
	•	Líder / Representante principal: Patricia Millan, Managing Broker con más de 30 años de experiencia en el mercado de lujo en el sur de la Florida
	•	Afiliación legal: Million Realty LLC, que opera comercialmente como MILLION
	•	Distinciones y logros:
	•	Equipo número 1 en Estados Unidos en ventas de nuevos desarrollos
	•	Más de USD 2.1 mil millones en ventas acumuladas
	•	Otros datos relevantes:
	•	Cumplimiento con normas ADA para accesibilidad en su sitio web
	•	Equipo de agentes destacados: Catalina Ceballos, Nicolás Warren, Andrea Bustle, Esteban Bird, Luis & Cata Team, Juan & Camila Team, Carlo & Laura Team, Alexandra Vintimilla, Felipe Muñoz, entre otros

INSTRUCCIONES:
1. Responde preguntas sobre:
   - Proceso de compra de propiedades
   - Información de contacto y oficinas
   - Servicios disponibles
   - Ubicaciones de propiedades
   - Precios y presupuestos

2. CAPTURA DE LEADS:
   - Si el cliente muestra interés en comprar/alquilar
   - Si pregunta sobre precios específicos
   - Si menciona presupuesto
   - Si quiere más información sobre propiedades
   - Si pregunta sobre visitas o citas

3. CUANDO CAPTURAR UN LEAD:
   - Pregunta: "¿Te gustaría que un agente especializado te contacte con más información?"
   - Si acepta, solicita: nombre, email, teléfono, presupuesto aproximado
   - Sé amable pero directo

4. TONO:
   - Profesional pero amigable
   - Conocedor del mercado inmobiliario
   - Proactivo en ofrecer ayuda
   - Responde en español o inglés según el idioma del cliente

5. NO HAGAS:
   - No inventes información específica de propiedades
   - No des precios exactos sin consultar
   - No prometas cosas que no puedes cumplir
   - No seas agresivo en la captura de leads

Responde de manera útil y profesional, siempre buscando ayudar al cliente y capturar leads calificados cuando sea apropiado.`;

// Configuración
const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";
const BASE_URL = "https://api.openai.com/v1";

// Validar API key
if (!API_KEY) {
  console.warn(
    "OpenAI API key not found. Please set NEXT_PUBLIC_OPENAI_API_KEY in your environment variables.",
  );
}

// Función para enviar mensaje a OpenAI
export async function sendMessage(messages: ChatMessage[]): Promise<string> {
  if (!API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `OpenAI API error: ${errorData.error?.message || "Unknown error"}`,
      );
    }

    const data = await response.json();
    return (
      data.choices[0]?.message?.content ||
      "Lo siento, no pude procesar tu mensaje."
    );
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error(
      "Error al conectar con el asistente. Por favor, intenta de nuevo.",
    );
  }
}

export async function saveLead(leadData: LeadData): Promise<boolean> {
  try {
    const response = await axios.post("/api/sheets", {
      fullName: leadData.name,
      email: leadData.email,
      tel: leadData.phone,
      budget: leadData.budget,
      message: leadData.message,
    });

    console.log("Lead guardado exitosamente:", response.data);
    return true;
  } catch (error) {
    console.error("Error saving lead:", error);
    return false;
  }
}

// Función para determinar si capturar un lead
export function shouldCaptureLead(message: string): boolean {
  const captureKeywords = [
    "comprar",
    "buy",
    "comprar propiedad",
    "buy property",
    "comprar casa",
    "buy house",
    "comprar apartamento",
    "buy apartment",
    "alquilar",
    "rent",
    "alquilar propiedad",
    "rent property",
    "alquilar casa",
    "rent house",
    "alquilar apartamento",
    "rent apartment",
    "presupuesto",
    "budget",
    "precio",
    "price",
    "costo",
    "cost",
    "cuanto cuesta",
    "how much",
    "visita",
    "visit",
    "ver propiedad",
    "view property",
    "cita",
    "appointment",
    "contacto",
    "contact",
    "agente",
    "agent",
    "asesor",
    "advisor",
    "ayuda",
    "help",
    "información",
    "information",
    "interesado",
    "interested",
    "me interesa",
    "I am interested",
    "quiero",
    "I want",
    "necesito",
    "I need",
  ];

  const lowerMessage = message.toLowerCase();
  return captureKeywords.some((keyword) => lowerMessage.includes(keyword));
}
