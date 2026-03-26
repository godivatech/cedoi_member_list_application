import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';

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

/**
 * Shared function to submit any form data to Firestore
 * Path: websites/cedoi-madurai/[formName]
 */
export const submitWebsiteForm = async (formName: string, data: any) => {
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
 * Fetch all submissions for the admin dashboard
 */
export const getWebsiteFormSubmissions = async (formName: string) => {
    try {
        const collectionRef = collection(db, "websites", "cedoi-madurai", formName);
        const q = query(collectionRef, orderBy("submittedAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching submissions: ", error);
        throw error;
    }
};
