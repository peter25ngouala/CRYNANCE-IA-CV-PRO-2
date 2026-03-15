import { GoogleGenAI, Type } from "@google/genai";
import { CVData, CVScore, CoverLetterData } from "../types";

const getApiKey = () => {
  const viteKey = import.meta.env.VITE_GEMINI_API_KEY;
  let processKey = "";
  try {
    processKey = process.env.GEMINI_API_KEY || "";
  } catch (e) {
    // process is not defined
  }
  
  let key = (viteKey as string) || processKey || "";
  key = key.trim();
  
  if (!key || key === "undefined" || key === "null") {
    console.error("Gemini API Key: ABSENTE ou invalide (valeur: " + key + "). Vérifiez Netlify.");
    return "";
  } else {
    console.log("Gemini API Key: Détectée (Longueur: " + key.length + ")");
    if (!key.startsWith("AIza")) {
      console.warn("Gemini API Key: Format inhabituel (ne commence pas par 'AIza'). Vérifiez votre clé dans Netlify.");
    }
  }
  return key;
};

const getAI = () => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  try {
    return new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Error initializing GoogleGenAI:", e);
    return null;
  }
};

export const generateProfessionalCV = async (data: CVData): Promise<CVData> => {
  const ai = getAI();
  if (!ai) {
    throw new Error("Clé API manquante ou invalide");
  }
  
  const modelName = "gemini-3-flash-preview"; // Use recommended model
  
  const dataWithoutPhoto = { ...data };
  delete dataWithoutPhoto.photo;

  const prompt = `Tu es un expert en recrutement international. Ta mission est d'optimiser ce CV pour qu'il soit extrêmement percutant, professionnel et surtout CONCIS.
  
  OBJECTIF : Le CV doit impérativement tenir sur UNE SEULE PAGE A4.
  
  RÈGLES DE RÉDACTION :
  1. CONCISION EXTRÊME : Utilise des phrases courtes, simples et directes. Supprime tout verbiage ou répétition.
  2. PROFIL : Rédige une accroche percutante de MAXIMUM 2 lignes.
  3. EXPÉRIENCES : Pour chaque expérience, limite la description à 3-4 puces (bullet points) maximum. Chaque puce doit être courte et orientée résultats.
  4. COMPÉTENCES : Sélectionne les 6 compétences les plus pertinentes pour le poste.
  5. QUALITÉS & DÉFAUTS : Liste 3 qualités et 2 défauts professionnels (non rédhibitoires).
  6. PAS D'INVENTION INUTILE : Optimise et valorise les données fournies par l'utilisateur. Si une section est vraiment vide, complète-la avec du contenu standard et réaliste pour le métier visé (${data.jobTitle || 'Professionnel'}), mais reste minimaliste.
  7. MISE EN PAGE : Le contenu doit être structuré pour une lecture rapide (scannabilité).
  
  Langue: Français (IMPÉRATIF : Tout le contenu doit être en français. Si des données d'entrée sont en anglais ou une autre langue, traduis-les systématiquement en français professionnel).
  
  Données de l'utilisateur : ${JSON.stringify(dataWithoutPhoto)}`;

  try {
    console.log(`Calling Gemini API with model: ${modelName}...`);
    console.log(">>> Sending request to Gemini API...");
    const response = await ai.models.generateContent({
      model: modelName,
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
    }).catch(err => {
      console.error(">>> Gemini API direct call failed:", err);
      throw err;
    });
    console.log(">>> Gemini API response received");

    if (!response || !response.text) {
      throw new Error("Réponse vide de l'IA");
    }

    let generated;
    try {
      generated = JSON.parse(response.text);
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", response.text);
      if (response.text.includes("<html>")) {
        throw new Error("L'IA a retourné une erreur HTML inattendue. Veuillez réessayer.");
      }
      throw new Error("Erreur de format de réponse de l'IA. Veuillez réessayer.");
    }
    return { ...data, ...generated };
  } catch (error: any) {
    console.error("Gemini CV Generation Full Error:", error);
    // Extract more details if available
    const details = error.response?.data?.error?.message || error.message || JSON.stringify(error);
    throw new Error(details);
  }
};

export const modifyCVWithAI = async (data: CVData, instruction: string): Promise<CVData> => {
  const ai = getAI();
  if (!ai) {
    throw new Error("Clé API manquante ou invalide");
  }
  
  const modelName = "gemini-3-flash-preview";
  
  const dataWithoutPhoto = { ...data };
  delete dataWithoutPhoto.photo;

  const prompt = `Tu es un expert en rédaction de CV. Ta tâche est de modifier le CV existant en suivant l'instruction de l'utilisateur.
  
  INSTRUCTION DE L'UTILISATEUR : "${instruction}"
  
  RÈGLES :
  1. Applique la modification demandée de manière intelligente et professionnelle.
  2. NE SUPPRIME PAS les informations existantes sauf si l'instruction le demande explicitement.
  3. Garde le ton professionnel et concis.
  4. Si l'utilisateur demande d'ajouter une section qui n'existe pas dans le schéma standard (comme "Certifications"), essaie de l'intégrer intelligemment dans les champs existants (par exemple, ajoute-la à la fin du profil ou dans les centres d'intérêt si approprié, ou modifie le champ 'profile' pour inclure ces nouvelles informations).
  5. Retourne l'intégralité de l'objet CV mis à jour.
  
  CV ACTUEL : ${JSON.stringify(dataWithoutPhoto)}`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
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
            jobTitle: { type: Type.STRING },
            firstName: { type: Type.STRING },
            lastName: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            customSections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                },
                required: ["title", "content"]
              }
            }
          },
          required: ["profile", "skills", "itSkills", "experiences", "education", "qualities", "flaws", "interests"]
        }
      }
    });

    if (!response || !response.text) {
      throw new Error("Réponse vide de l'IA");
    }

    const generated = JSON.parse(response.text);
    return { ...data, ...generated };
  } catch (error: any) {
    console.error("Gemini CV Modification Error:", error);
    throw new Error(error.message || "Erreur lors de la modification du CV");
  }
};

export const scoreCV = async (data: CVData): Promise<CVScore> => {
  const ai = getAI();
  if (!ai) {
    throw new Error("Clé API manquante");
  }
  const modelName = "gemini-3-flash-preview";
  const prompt = `Analyse ce CV et donne un score sur 100, ainsi que les points forts, points faibles et conseils d'amélioration.
  CV: ${JSON.stringify(data)}`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
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

    if (!response || !response.text) throw new Error("Réponse vide");
    return JSON.parse(response.text);
  } catch (error: any) {
    console.error("Gemini CV Scoring Error:", error);
    throw new Error(error.message || "Erreur de scoring");
  }
};

export const generateCoverLetter = async (cvData: CVData, letterData: CoverLetterData): Promise<string> => {
  const ai = getAI();
  if (!ai) {
    throw new Error("Clé API manquante");
  }
  const modelName = "gemini-3-flash-preview";
  
  const prompt = `Tu es un expert en recrutement. Ta mission est de rédiger une lettre de motivation professionnelle, percutante et personnalisée pour le site CRYNANCE IA CV PRO 2.

### INSTRUCTIONS CRITIQUES :
- GÉNÈRE UNIQUEMENT LA LETTRE FINALE.
- NE PAS AJOUTER D'EXPLICATION AVANT OU APRÈS LA LETTRE.
- NE PAS DONNER TON AVIS OU COMMENTER LA QUALITÉ DE LA LETTRE.
- NE PAS DONNER DE CONSEILS.
- LA RÉPONSE DOIT ÊTRE DIRECTEMENT LA LETTRE PRÊTE À UTILISER.

### STRUCTURE OBLIGATOIRE DE LA LETTRE :

1. Informations du candidat (en haut à gauche) :
${letterData.lastName} ${letterData.firstName}
${letterData.address}
${letterData.phone}
${letterData.email}

2. Informations de l'entreprise (un peu plus bas à droite) :
${letterData.company}
${letterData.recruiterName ? `À l'attention de ${letterData.recruiterName}` : 'À l\'attention du Responsable du Recrutement'}
${letterData.companyAddress}

3. Date et lieu :
Fait à ${letterData.jobCity}, le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}

4. Objet :
Objet : Candidature au poste de ${letterData.targetJob} en ${letterData.contractType}

5. Corps de la lettre (3 paragraphes maximum) :
- Paragraphe 1 : Présentation du candidat et accroche.
- Paragraphe 2 : Compétences et expériences clés en lien avec le poste (utilise les infos du CV si disponibles).
- Paragraphe 3 : Motivation spécifique pour rejoindre l'entreprise et proposition d'entretien.

6. Formule de politesse finale :
"Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."

7. Signature :
${letterData.firstName} ${letterData.lastName}

### CONTEXTE SUPPLÉMENTAIRE :
- Profil du candidat : ${cvData.profile}
- Expériences clés : ${JSON.stringify(cvData.experiences.slice(0, 3))}
- Motivations spécifiques de l'utilisateur : ${letterData.motivation || 'Non spécifié'}

Langue : Français professionnel.`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    return response.text || "";
  } catch (error: any) {
    console.error("Gemini Cover Letter Error:", error);
    throw new Error(error.message || "Erreur de génération de lettre");
  }
};
