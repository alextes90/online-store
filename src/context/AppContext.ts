import { createContext } from 'react';
import { FilterValue } from '../types/FilterTypes';
import { Product } from '../types/ProductTypes';
import { IsModalContext } from '../types/ProductTypes';

export const productsContext = createContext<Product[]>([]);
export const brandsContext = createContext<FilterValue[]>([]);
export const categoriesContext = createContext<FilterValue[]>([]);
export const isModalContext = createContext<IsModalContext>({
  isModal: false,
  setIsModal: () => {
    //do nothing
  },
});
