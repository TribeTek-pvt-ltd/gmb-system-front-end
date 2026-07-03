import { createDbHelper } from './base';
import { ProductCatalog } from './types';

const productsHelper = createDbHelper<ProductCatalog>('products_catalog', 'products_catalog_id');

export const getProducts = async (categoryId?: string) => {
  try {
    if (categoryId) {
      const { data, error } = await productsHelper.query().eq('category_id', categoryId).order('created_at', { ascending: false });
      if (error) throw error;
      return data as ProductCatalog[];
    }
    return productsHelper.getAll();
  } catch (err) {
    console.warn("Failed to get products (schema might be missing or RLS):", err);
    return [];
  }
};

export const getProductById = productsHelper.getById;
export const createProduct = productsHelper.create;
export const updateProduct = productsHelper.update;
export const deleteProduct = productsHelper.delete;
