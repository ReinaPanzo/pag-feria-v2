import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import { db, auth, storage } from '@/src/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Interfaces based on blueprint
export interface EventEntity {
  id?: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  latitude?: number;
  longitude?: number;
  category: string;
  imageUrl?: string;
  imageName?: string;
  isFeatured?: boolean;
}

export interface CategoryEntity {
  id?: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface LocationEntity {
  id?: string;
  name: string;
  address?: string;
}

// Services
export const EventService = {
  async getEvents(): Promise<EventEntity[]> {
    const path = 'events';
    try {
      const q = query(collection(db, path), orderBy('date', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        date: (d.data().date as Timestamp).toDate()
      })) as EventEntity[];
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
      return [];
    }
  },

  subscribeToEvents(callback: (events: EventEntity[]) => void) {
    const path = 'events';
    const q = query(collection(db, path), orderBy('date', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        date: (d.data().date as Timestamp).toDate()
      })) as EventEntity[];
      callback(events);
    }, (e) => {
      handleFirestoreError(e, OperationType.GET, path);
    });
  },

  async addEvent(event: Omit<EventEntity, 'id'>) {
    const path = 'events';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...event,
        date: Timestamp.fromDate(event.date)
      });
      return docRef.id;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  },

  async updateEvent(id: string, event: Partial<EventEntity>) {
    const path = `events/${id}`;
    try {
      const updateData: any = { ...event };
      if (event.date) updateData.date = Timestamp.fromDate(event.date);
      await updateDoc(doc(db, 'events', id), updateData);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, path);
    }
  },

  async deleteEvent(id: string) {
    const path = `events/${id}`;
    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, path);
    }
  },

  async uploadImage(file: File): Promise<string> {
    const storageRef = ref(storage, `events/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  }
};

export const CategoryService = {
  async getCategories(): Promise<CategoryEntity[]> {
    const path = 'categories';
    try {
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as CategoryEntity[];
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
      return [];
    }
  },
  
  async addCategory(cat: Omit<CategoryEntity, 'id'>) {
    const path = 'categories';
    try {
      await addDoc(collection(db, path), cat);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
};

export const LocationService = {
  async getLocations(): Promise<LocationEntity[]> {
    const path = 'locations';
    try {
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as LocationEntity[];
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
      return [];
    }
  }
};
