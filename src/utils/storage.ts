/**
 * Utility to handle localStorage safely and manage large data like photos separately.
 */

const PHOTO_KEY = 'currentCV_photo';
const CV_DATA_KEY = 'currentCV';
const LETTER_DATA_KEY = 'currentLetterData';
const LETTER_CONTENT_KEY = 'currentLetter';

export const storage = {
  saveCV: (data: any) => {
    try {
      // Separate photo from main data to reduce size of the main object
      const { photo, ...textData } = data;
      
      // Save text data
      localStorage.setItem(CV_DATA_KEY, JSON.stringify(textData));
      
      // Save photo separately if it exists
      if (photo) {
        try {
          localStorage.setItem(PHOTO_KEY, photo);
        } catch (e) {
          console.warn("Photo is too large for localStorage, saving to sessionStorage instead.");
          sessionStorage.setItem(PHOTO_KEY, photo);
          // Remove from localStorage if it was there to free up space
          localStorage.removeItem(PHOTO_KEY);
        }
      }
    } catch (e) {
      console.error("Failed to save CV to localStorage:", e);
      // Fallback to sessionStorage for everything if localStorage is full
      try {
        sessionStorage.setItem(CV_DATA_KEY, JSON.stringify(data));
      } catch (se) {
        console.error("Even sessionStorage failed:", se);
      }
    }
  },

  loadCV: () => {
    try {
      const textDataJson = localStorage.getItem(CV_DATA_KEY) || sessionStorage.getItem(CV_DATA_KEY);
      if (!textDataJson) return null;
      
      const data = JSON.parse(textDataJson);
      
      // Load photo from either storage
      const photo = localStorage.getItem(PHOTO_KEY) || sessionStorage.getItem(PHOTO_KEY);
      if (photo) {
        data.photo = photo;
      }
      
      return data;
    } catch (e) {
      console.error("Failed to load CV from storage:", e);
      return null;
    }
  },

  saveLetterData: (data: any) => {
    try {
      localStorage.setItem(LETTER_DATA_KEY, JSON.stringify(data));
    } catch (e) {
      sessionStorage.setItem(LETTER_DATA_KEY, JSON.stringify(data));
    }
  },

  loadLetterData: () => {
    const data = localStorage.getItem(LETTER_DATA_KEY) || sessionStorage.getItem(LETTER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveLetterContent: (content: any) => {
    try {
      localStorage.setItem(LETTER_CONTENT_KEY, JSON.stringify(content));
    } catch (e) {
      sessionStorage.setItem(LETTER_CONTENT_KEY, JSON.stringify(content));
    }
  },

  loadLetterContent: () => {
    const data = localStorage.getItem(LETTER_CONTENT_KEY) || sessionStorage.getItem(LETTER_CONTENT_KEY);
    return data ? JSON.parse(data) : null;
  },

  clearCV: () => {
    localStorage.removeItem(CV_DATA_KEY);
    localStorage.removeItem(PHOTO_KEY);
    sessionStorage.removeItem(CV_DATA_KEY);
    sessionStorage.removeItem(PHOTO_KEY);
  }
};
