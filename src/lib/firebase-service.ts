import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';
import { CampaignBrief } from '../types';
import { generateMarkdown } from './export';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// NOTE: Since the automated provisioning failed, this relies on a manual fallback.
// In a real scenario you would replace the values in firebase-applet-config.json
// with your actual Firebase configuration.

export async function saveBriefToDatabase(brief: CampaignBrief) {
  try {
    const md = generateMarkdown(brief);
    
    // In a real app we'd save to a specific collection like 'campaignBriefs'
    const docRef = await addDoc(collection(db, 'campaignBriefs'), {
      theme: brief.theme || 'Untitled Brief',
      startDate: brief.startDate,
      endDate: brief.endDate,
      primaryGoal: brief.primaryGoal,
      createdAt: serverTimestamp(),
      markdownContent: md,
      rawBrief: brief
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving brief to Firebase:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
