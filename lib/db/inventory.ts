import { supabase } from '../supabaseClient';
import { Inventory } from './types';

export const getInventory = async (productId?: string) => {
  try {
    let query = supabase.from('inventory').select('*, product:products_catalog(*, category:categories!products_catalog_category_id_fkey(name))').order('updated_at', { ascending: false });
    if (productId) query = query.eq('product_id', productId);
    
    const { data, error } = await query;
    if (error) throw error;
    return data as any[];
  } catch (err) {
    console.warn("Failed to get inventory (schema might be missing or RLS):", err);
    return [];
  }
};

export const getInventoryById = async (id: string) => {
  const { data, error } = await supabase.from('inventory').select('*').eq('id', id).single();
  if (error) throw error;
  return data as Inventory;
};

export const createInventory = async (inventoryItem: Omit<Inventory, 'id' | 'updated_at'>) => {
  const { data, error } = await supabase.from('inventory').insert([inventoryItem]).select().single();
  if (error) throw error;
  return data as Inventory;
};

export const updateInventory = async (id: string, updates: Partial<Omit<Inventory, 'id' | 'updated_at'>>) => {
  const { data, error } = await supabase.from('inventory').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Inventory;
};

export const deleteInventory = async (id: string) => {
  const { error } = await supabase.from('inventory').delete().eq('id', id);
  if (error) throw error;
  return true;
};
