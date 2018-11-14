export interface Category {
  category: string;
  icon: string;
  count: number;
  key: string;
}
export interface CategoryId extends Category {
  id: string;
}
