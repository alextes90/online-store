import axios from 'axios';
import { ApiEndpoints, ApiSettings } from '../types/ApiTypes';
import { Product } from '../types/ProductTypes';

export async function getProducts(): Promise<Product[] | undefined> {
  try {
    const getUrl = `${ApiSettings.Url}${ApiEndpoints.Products}`;
    const result = await axios.get(getUrl);
    return result.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error', error.message);
      throw error;
    }
  }
}
