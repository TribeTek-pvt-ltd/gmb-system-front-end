import { supabase } from '../supabaseClient';
import { Job, PaymentHistory, Invoice } from './types';

export const getJobs = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      customer:customers(*),
      payment_history(*),
      invoices(*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getJobById = async (id: string) => {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      customer:customers(*),
      payment_history(*),
      invoices(*),
      enquiry:enquiries(*),
      quotation:quotations(*)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createJob = async (job: Omit<Job, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert([job])
    .select()
    .single();
  
  if (error) throw error;
  return data as Job;
};

export const updateJob = async (id: string, updates: Partial<Omit<Job, 'id' | 'created_at' | 'updated_at'>>) => {
  const { data, error } = await supabase
    .from('jobs')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Job;
};

export const addPayment = async (payment: Omit<PaymentHistory, 'id' | 'created_at'>) => {
  const { data: pData, error: pError } = await supabase
    .from('payment_history')
    .insert([payment])
    .select()
    .single();
  
  if (pError) throw pError;

  // Update paid_amount in job
  const { data: job } = await supabase.from('jobs').select('paid_amount').eq('id', payment.job_id).single();
  if (job) {
    const newPaidAmount = (job.paid_amount || 0) + payment.amount;
    await updateJob(payment.job_id, { paid_amount: newPaidAmount });
  }

  return pData as PaymentHistory;
};

export const addInvoice = async (invoice: Omit<Invoice, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('invoices')
    .insert([invoice])
    .select()
    .single();
  
  if (error) throw error;
  return data as Invoice;
};
