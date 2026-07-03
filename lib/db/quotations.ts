import { supabase } from '../supabaseClient';
import { Quotation, QuotationItem } from './types';

export const getQuotations = async () => {
  const { data, error } = await supabase.from('quotations').select(`
    *,
    customer:customers ( name ),
    items:quotation_items ( * )
  `).order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getQuotationsByCustomerId = async (customerId: string) => {
  const { data, error } = await supabase.from('quotations').select(`
    *,
    items:quotation_items ( * )
  `).eq('customer_id', customerId).order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getQuotationById = async (id: string) => {
  const { data, error } = await supabase.from('quotations').select(`
    *,
    customer:customers ( * ),
    items:quotation_items ( *, product:products_catalog ( item_name, unit ) )
  `).eq('id', id).single();
  
  if (error) throw error;
  return data;
};

export const createQuotation = async (
  quotation: Omit<Quotation, 'id' | 'created_at' | 'updated_at'>,
  items: Omit<QuotationItem, 'id' | 'quotation_id' | 'created_at'>[]
) => {
  const { data: qData, error: qError } = await supabase.from('quotations').insert([quotation]).select().single();
  if (qError) throw qError;

  if (items.length > 0) {
    const itemsToInsert = items.map(item => ({
      ...item,
      quotation_id: qData.id,
    }));
    const { error: iError } = await supabase.from('quotation_items').insert(itemsToInsert);
    if (iError) throw iError;
  }

  return qData as Quotation;
};

export const updateQuotation = async (
  id: string, 
  updates: Partial<Omit<Quotation, 'id' | 'created_at' | 'updated_at'>>
) => {
  const { data, error } = await supabase.from('quotations').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Quotation;
};

export const deleteQuotation = async (id: string) => {
  const { error } = await supabase.from('quotations').delete().eq('id', id);
  if (error) throw error;
  return true;
};
