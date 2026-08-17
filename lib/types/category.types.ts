export interface Category {
  id: number;
  parentId?: number | null;
  name: string;
  slug: string;
  commissionRate?: number;
  iconUrl?: string | null;
  active: boolean;
}
