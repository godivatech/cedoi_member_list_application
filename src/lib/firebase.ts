import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, orderBy, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB1AzcVwWPTXDT3Hm2F6CpJ2IxqtNCZKnk",
  authDomain: "godivatech-websites.firebaseapp.com",
  projectId: "godivatech-websites",
  storageBucket: "godivatech-websites.firebasestorage.app",
  messagingSenderId: "1000295393026",
  appId: "1:1000295393026:web:f7a6539d53e64ce858841b",
  measurementId: "G-DS3GEEV8LG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export interface MemberApplication {
  id: string;
  businessName: string;
  category: string;
  name: string;
  phone: string;
  service: string;
  photoUrl?: string;
  submittedAt?: Timestamp;
}

/**
 * Shared function to submit any form data to Firestore
 * Path: websites/cedoi-madurai/[formName]
 */
export const submitWebsiteForm = async (formName: string, data: Omit<MemberApplication, 'id' | 'submittedAt'>) => {
    try {
        // We use 'cedoi-madurai' as the document ID for this specific website
        const collectionRef = collection(db, "websites", "cedoi-madurai", formName);
        
        const docRef = await addDoc(collectionRef, {
            ...data,
            submittedAt: serverTimestamp(),
        });
        
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error submitting form: ", error);
        return { success: false, error };
    }
};

/**
 * Update an existing submission
 */
export const updateWebsiteFormSubmission = async (formName: string, id: string, data: Partial<Omit<MemberApplication, 'id' | 'submittedAt'>>) => {
    try {
        const docRef = doc(db, "websites", "cedoi-madurai", formName, id);
        await updateDoc(docRef, data);
        return { success: true };
    } catch (error) {
        console.error("Error updating submission: ", error);
        return { success: false, error };
    }
};

/**
 * Fetch all submissions for the admin dashboard
 */
export const getWebsiteFormSubmissions = async (formName: string): Promise<MemberApplication[]> => {
    try {
        const collectionRef = collection(db, "websites", "cedoi-madurai", formName);
        const q = query(collectionRef, orderBy("submittedAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as MemberApplication));
    } catch (error) {
        console.error("Error fetching submissions: ", error);
        throw error;
    }
};

/**
 * Fetch a single submission by its ID
 */
export const getWebsiteFormSubmissionById = async (formName: string, id: string): Promise<MemberApplication | null> => {
    try {
        const docRef = doc(db, "websites", "cedoi-madurai", formName, id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as MemberApplication;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching single submission: ", error);
        throw error;
    }
};
