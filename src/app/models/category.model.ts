export interface Category {
  category: string;
  icon: string;
  count: number;
  key: string;
  updateDate?: any;
}
export interface CategoryId extends Category {
  id: string;
}
