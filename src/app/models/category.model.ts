export interface Category {
  name: string;
  icon: string;
  count: number;
}
export interface CategoryId extends Category {
  id: string;
}
