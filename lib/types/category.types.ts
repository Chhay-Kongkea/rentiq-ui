export interface Category {
  id: string;
  parentId?: string | null;
  name: string;
  slug: string;
  commissionRate?: number;
  iconUrl?: string | null;
  active: boolean;
}
