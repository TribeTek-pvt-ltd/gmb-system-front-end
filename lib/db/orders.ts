import { supabase } from '../supabaseClient';
import { Order } from './types';

export const getOrders = async () => {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Order[];
};

export const getOrderById = async (id: string) => {
  const { data, error } = await supabase.from('orders').select('*').eq('order_id', id).single();
  if (error) throw error;
  return data as Order;
};

export const createOrder = async (order: Omit<Order, 'order_id' | 'order_date' | 'created_at'>) => {
  const { data, error } = await supabase.from('orders').insert([order]).select().single();
  
  if (error) throw error;

  // Update inventory if stock is received
  if (order.status === 'Stock Received') {
    try {
      const { data: inv } = await supabase
        .from('inventory')
        .select('*')
        .eq('product_id', order.products_catalog_id)
        .maybeSingle();

      if (inv) {
        await supabase
          .from('inventory')
          .update({ 
            quantity_on_hand: (inv.quantity_on_hand || 0) + order.quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', inv.id);
      } else {
        await supabase
          .from('inventory')
          .insert([{
            product_id: order.products_catalog_id,
            quantity_on_hand: order.quantity,
            reorder_level: 0
          }]);
      }
    } catch (invErr) {
      console.error("Failed to update inventory sync:", invErr);
      // We don't throw here to avoid failing the order creation if inventory update fails
    }
  }

  return data as Order;
};

export const updateOrder = async (id: string, updates: Partial<Omit<Order, 'order_id' | 'order_date' | 'created_at'>>) => {
  const { data, error } = await supabase.from('orders').update(updates).eq('order_id', id).select().single();
  if (error) throw error;
  return data as Order;
};

export const deleteOrder = async (id: string) => {
  const { error } = await supabase.from('orders').delete().eq('order_id', id);
  if (error) throw error;
  return true;
};
