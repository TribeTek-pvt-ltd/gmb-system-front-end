import { createDbHelper } from './base';
import { Customer } from './types';

const customersHelper = createDbHelper<Customer>('customers', 'customer_id');

export const getCustomers = customersHelper.getAll;
export const getCustomerById = customersHelper.getById;
export const createCustomer = customersHelper.create;
export const updateCustomer = customersHelper.update;
export const deleteCustomer = customersHelper.delete;
