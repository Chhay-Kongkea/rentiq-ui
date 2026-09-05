export interface Category {
  id: string;
  parentId?: string | null;
  name: string;
  slug: string;
  commissionRate?: number;
  iconUrl?: string | null;
  active: boolean;
  specificationFields?: CategorySpecificationField[];
}

export type CategorySpecificationFieldType = "TEXT" | "NUMBER" | "SELECT" | "BOOLEAN" | string;

export interface CategorySpecificationField {
  key: string;
  label: string;
  type: CategorySpecificationFieldType;
  required?: boolean;
  options?: string[];
}
