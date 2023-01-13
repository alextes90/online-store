export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  images: string[];
  rating: number;
  stock: number;
  thumbnail: string;
  discountPercentage: number;
  category: string;
  quantity?: number;
};

export interface ICartProducts extends Product {
  index: number;
}

export enum ProductDetailsLabels {
  Description = 'Description',
  DiscountPercentage = 'Discount',
  Rating = 'Rating',
  Stock = 'Stock',
  Brand = 'Brand',
  Category = 'Category',
  Currency = '€',
}

export type IsModalContext = {
  isModal: boolean;
  setIsModal: (props: boolean) => void;
};
