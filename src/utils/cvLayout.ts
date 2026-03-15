import { CVData, CVLayout } from '../types';

export const getDefaultLayout = (template: string): CVLayout => {
  return {
    left: ['contact', 'skills', 'itSkills', 'languages', 'qualities', 'interests'],
    right: ['profile', 'experiences', 'education']
  };
};

export const getAllSections = (data: CVData): string[] => {
  const base = [
    'contact', 'profile', 'skills', 'itSkills', 'experiences', 
    'education', 'qualities', 'flaws', 'interests', 'languages'
  ];
  const custom = data.customSections?.map((_, i) => `custom_${i}`) || [];
  return [...base, ...custom];
};
