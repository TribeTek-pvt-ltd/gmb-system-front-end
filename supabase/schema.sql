-- Employees Table
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  designation TEXT,
  phone TEXT,
  status TEXT CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
  last_login TIMESTAMPTZ,
  privileges JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers Table
CREATE TABLE customers (
  customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  status TEXT CHECK (status IN ('Lead', 'Enquired', 'Quote Sent', 'order Completed')) DEFAULT 'Lead',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer Activities
CREATE TABLE customer_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(customer_id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enquiries / Jobs Table
CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(customer_id) ON DELETE CASCADE,
  enquiry_date TIMESTAMPTZ DEFAULT NOW(),
  measurement_date TIMESTAMPTZ,
  status TEXT CHECK (status IN ('Lead', 'Enquired', 'Quote Sent', 'Job Created', 'In Progress', 'Completed', 'Installed')) DEFAULT 'Lead',
  is_job BOOLEAN DEFAULT FALSE,
  notes TEXT,
  measurement_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT CHECK (name IN ('Curtains', 'Blinds', 'Hardware', 'Fabrics')) NOT NULL,
  parent UUID REFERENCES categories(id)
);

-- Product Catalog
CREATE TABLE products_catalog (
  products_catalog_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  description TEXT,
  base_price NUMERIC(10, 2) NOT NULL,
  unit TEXT CHECK (unit IN ('m', 'mm', 'cm', 'count', 'sqm')),
  status TEXT CHECK (status IN ('Active', 'Inactive', 'Draft')) DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suppliers
CREATE TABLE suppliers (
  supplier_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_name TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  status TEXT CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products_catalog(products_catalog_id),
  quantity_on_hand INT DEFAULT 0,
  reorder_level INT DEFAULT 0,
  location TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Suppliers Link
CREATE TABLE product_suppliers (
  products_catalog_id UUID REFERENCES products_catalog(products_catalog_id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
  PRIMARY KEY (products_catalog_id, supplier_id)
);

-- Orders
CREATE TABLE orders (
  order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES suppliers(supplier_id),
  products_catalog_id UUID REFERENCES products_catalog(products_catalog_id),
  job_id UUID REFERENCES enquiries(id),
  quantity INT NOT NULL,
  unit TEXT CHECK (unit IN ('m', 'mm', 'cm', 'count', 'sqm')),
  status TEXT CHECK (status IN ('Order Placed', 'Pending', 'Completed', 'Stock Received')),
  total_amount NUMERIC(10, 2) NOT NULL,
  order_date TIMESTAMPTZ DEFAULT NOW(),
  expected_delivery_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- File Records
CREATE TABLE file_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(customer_id) ON DELETE CASCADE,
  job_id UUID REFERENCES enquiries(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_type TEXT CHECK (file_type IN ('PDF', 'Image')),
  file_category TEXT CHECK (file_category IN ('Measurement', 'Quote', 'Fabric')),
  file_path TEXT NOT NULL,
  version INT DEFAULT 1,
  generated_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotations
CREATE TABLE quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(customer_id) ON DELETE CASCADE,
  enquiry_id UUID REFERENCES enquiries(id) ON DELETE SET NULL,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  discount NUMERIC(10, 2) DEFAULT 0.00,
  tax NUMERIC(10, 2) DEFAULT 0.00,
  grand_total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  status TEXT CHECK (status IN ('Draft', 'Sent', 'Accepted', 'Rejected')) DEFAULT 'Draft',
  valid_until TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotation Line Items
CREATE TABLE quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
  products_catalog_id UUID REFERENCES products_catalog(products_catalog_id) ON DELETE SET NULL,
  description TEXT,
  quantity NUMERIC(10, 2) NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
