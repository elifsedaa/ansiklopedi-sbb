export interface Suggestion {
  id?: string;
  entryId?: string | null;
  submitter: { name: string; email?: string };
  message: string;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
  moderation?: { by?: string; note?: string; updatedAt?: string };
}
