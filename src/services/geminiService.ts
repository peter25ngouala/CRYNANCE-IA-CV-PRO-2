import { GoogleGenAI, Type } from "@google/genai";
import { CVData, CVScore } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateProfessionalCV = async (data: CVData): Promise<CVData> => {
  const prompt = `Tu es un expert en recrutement international et rédacteur de CV professionnel. Ta mission est de compléter et d'optimiser ce CV pour le rendre extrêmement compétitif, attrayant et compatible avec les systèmes ATS.

  RÈGLES STRICTES : 
  1. AUCUNE SECTION NE DOIT ÊTRE VIDE. Si l'utilisateur n'a pas fourni d'informations pour une section, tu DOIS inventer du contenu professionnel réaliste, valorisant et parfaitement cohérent avec le métier visé (${data.jobTitle || 'Professionnel'}).
  2. PROFIL : Rédige un paragraphe d'accroche percutant de 3 à 5 lignes qui résume l'expertise et la valeur ajoutée.
  3. COMPÉTENCES : Fournis EXACTEMENT 6 compétences techniques (skills) et 6 compétences informatiques/outils (itSkills) pertinentes.
  4. EXPÉRIENCES : Fournis au moins 3 expériences professionnelles détaillées. Pour chaque expérience, invente un nom d'entreprise crédible, des dates cohérentes et 4-5 puces de missions/réalisations concrètes et chiffrées.
  5. FORMATION : Fournis au moins 2 formations académiques réalistes (Diplôme, École, Année).
  6. QUALITÉS & INTÉRÊTS : Ajoute 5 qualités professionnelles (soft skills) et 4 centres d'intérêt qui valorisent le profil.
  7. TON : Utilise un vocabulaire soutenu, dynamique et orienté résultats.
  
  Langue: ${data.language === 'fr' ? 'Français' : 'Anglais'}.
  
  Données actuelles de l'utilisateur (à compléter et enrichir) : ${JSON.stringify(data)}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          profile: { type: Type.STRING },
          skills: { type: Type.ARRAY, items: { type: Type.STRING } },
          itSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          experiences: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                company: { type: Type.STRING },
                position: { type: Type.STRING },
                startDate: { type: Type.STRING },
                endDate: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ["company", "position", "startDate", "endDate", "description"]
            }
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                school: { type: Type.STRING },
                degree: { type: Type.STRING },
                year: { type: Type.STRING },
              },
              required: ["school", "degree", "year"]
            }
          },
          qualities: { type: Type.ARRAY, items: { type: Type.STRING } },
          flaws: { type: Type.ARRAY, items: { type: Type.STRING } },
          interests: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["profile", "skills", "itSkills", "experiences", "education", "qualities", "flaws", "interests"]
      }
    }
  });

  const generated = JSON.parse(response.text);
  return { ...data, ...generated };
};

export const scoreCV = async (data: CVData): Promise<CVScore> => {
  const prompt = `Analyse ce CV et donne un score sur 100, ainsi que les points forts, points faibles et conseils d'amélioration.
  CV: ${JSON.stringify(data)}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.INTEGER },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          advice: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["score", "strengths", "weaknesses", "advice"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateCoverLetter = async (cvData: CVData, letterData: any): Promise<string> => {
  const prompt = `Rédige une lettre de motivation professionnelle et percutante.
  Utilise les informations du CV: ${JSON.stringify(cvData)}
  Et les informations spécifiques à la lettre: ${JSON.stringify(letterData)}
  Structure: En-tête, Objet, Introduction, Présentation, Motivation, Conclusion.
  Corrige l'orthographe et la grammaire.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text || "";
};
