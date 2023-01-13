export type FilterValue = {
  id: number;
  title: string;
};

export enum FilterStringParams {
  Brand = 'brand',
  Cat = 'category',
}
export enum FilterNumberParams {
  Price = 'price',
  Stock = 'stock',
}

export type FilterCheckbox = {
  id: number;
  title: string;
  isCheked: boolean;
  products: number;
  productsFiltered: number;
};

export const searchFields = [
  'title',
  'description',
  'price',
  'brand',
  'rating',
  'stock',
  'discountPercentage',
  'category',
];

export const filterDelimiter = '_';
