import { collection, addDoc, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { ChatMessage } from '../types';

export const addMessage = async (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
  await addDoc(collection(db, 'messages'), {
    ...message,
    timestamp: Timestamp.now(),
  });
};

export const subscribeToMessages = (callback: (messages: ChatMessage[]) => void) => {
  const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    })) as ChatMessage[];
    callback(messages);
  });
};
