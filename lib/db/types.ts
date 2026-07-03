export type Employee = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  designation: string | null;
  phone: string | null;
  status: 'Active' | 'Inactive';
  last_login: string | null;
  created_at: string;
  privileges?: Record<string, { create: boolean; read: boolean; update: boolean; delete: boolean; all: boolean }>;
};

export type Customer = {
  customer_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  status: 'Lead' | 'Enquired' | 'Quote Sent' | 'order Completed';
  created_at: string;
  updated_at: string;
};

export type Enquiry = {
  id: string;
  customer_id: string;
  enquiry_date: string;
  measurement_date: string | null;
  status: 'Lead' | 'Enquired' | 'Quote Sent' | 'Job Created' | 'In Progress' | 'Completed' | 'Installed';
  is_job: boolean;
  notes: string | null;
  measurement_data?: Record<string, any> | null;
  created_at: string;
};

export type CustomerActivity = {
  id: string;
  customer_id: string;
  description: string;
  created_at: string;
};

export type FileRecord = {
  id: string;
  customer_id: string;
  job_id: string | null;
  file_name: string;
  file_type: 'PDF' | 'Image';
  file_category: 'Measurement' | 'Quote' | 'Fabric';
  file_path: string;
  version: number;
  generated_date: string | null;
  created_at: string;
};

export type Category = {
  id: string;
  name: 'Curtains' | 'Blinds' | 'Hardware' | 'Fabrics';
  parent: string | null;
};

export type PricingItem = {
  id: string;
  name: string;
  price: number | null;
};

export type PricingGroup = {
  id: string;
  group_name: string;
  price: number | null;     // optional group-level price
  items: PricingItem[];     // sub-items (sub-categories / fabrics)
};

export type ProductCatalog = {
  products_catalog_id: string;
  item_name: string;
  category_id: string;
  sub_category_id?: string | null;
  description: string | null;
  pricing_groups: PricingGroup[];
  unit: 'm' | 'mm' | 'cm' | 'count';
  status: 'Active' | 'Inactive';
  is_component: boolean;
  components: string[];
  created_at: string;
};

export type Inventory = {
  id: string;
  product_id: string;
  quantity_on_hand: number;
  reorder_level: number;
  location: string | null;
  updated_at: string;
};

export type Supplier = {
  supplier_id: string;
  name: string;
  contact_name: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  status: 'Active' | 'Inactive';
  created_at: string;
};

export type ProductSupplier = {
  products_catalog_id: string;
  supplier_id: string;
};

export type Order = {
  order_id: string;
  supplier_id: string | null;
  products_catalog_id: string;
  job_id: string | null;
  quantity: number;
  unit: 'm' | 'mm' | 'cm' | 'count' | 'sqm';
  status: 'Order Placed' | 'Pending' | 'Completed' | 'Stock Received';
  total_amount: number;
  order_date: string;
  expected_delivery_date: string | null;
  created_at: string;
};

export type Quotation = {
  id: string;
  customer_id: string;
  enquiry_id: string | null;
  total_amount: number;
  discount: number;
  tax: number;
  grand_total: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
  valid_until: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type QuotationItem = {
  id: string;
  quotation_id: string;
  products_catalog_id: string | null;
  description: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  metadata?: Record<string, any> | null;
  created_at: string;
};

export type Job = {
  id: string;
  customer_id: string;
  enquiry_id: string | null;
  quotation_id: string | null;
  measurement_id: string | null;
  status: 'Job Created' | 'In Progress' | 'Completed' | 'Installed';
  total_amount: number;
  paid_amount: number;
  created_at: string;
  updated_at: string;
};

export type PaymentHistory = {
  id: string;
  job_id: string;
  amount: number;
  payment_date: string;
  payment_method: string | null;
  reference_number: string | null;
  notes: string | null;
  created_at: string;
};

export type Invoice = {
  id: string;
  job_id: string;
  invoice_number: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Cancelled';
  created_at: string;
};
