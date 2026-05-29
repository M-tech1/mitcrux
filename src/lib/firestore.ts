import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type SubmissionStatus = "new" | "read" | "replied" | "archived";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  submittedAt: Timestamp | null;
  status: SubmissionStatus;
}

export type NewSubmission = Omit<ContactSubmission, "id" | "submittedAt" | "status">;

export async function submitContactForm(data: NewSubmission): Promise<void> {
  await addDoc(collection(db, "contacts"), {
    ...data,
    status: "new" as SubmissionStatus,
    submittedAt: serverTimestamp(),
  });
}

export function subscribeToSubmissions(
  callback: (submissions: ContactSubmission[]) => void
): () => void {
  const q = query(collection(db, "contacts"), orderBy("submittedAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactSubmission)));
  });
}

export async function getSubmission(id: string): Promise<ContactSubmission | null> {
  const snap = await getDoc(doc(db, "contacts", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as ContactSubmission;
}

export async function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus
): Promise<void> {
  await updateDoc(doc(db, "contacts", id), { status });
}

export async function deleteSubmission(id: string): Promise<void> {
  await deleteDoc(doc(db, "contacts", id));
}
