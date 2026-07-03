-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(customer_id) ON DELETE CASCADE,
  enquiry_id UUID REFERENCES enquiries(id) ON DELETE SET NULL,
  quotation_id UUID REFERENCES quotations(id) ON DELETE SET NULL,
  measurement_id UUID, -- References file_records or a future measurements table
  status TEXT CHECK (status IN ('Job Created', 'In Progress', 'Completed', 'Installed')) DEFAULT 'Job Created',
  total_amount NUMERIC(10, 2) DEFAULT 0.00,
  paid_amount NUMERIC(10, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment History Table
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  payment_date TIMESTAMPTZ DEFAULT NOW(),
  payment_method TEXT,
  reference_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('Draft', 'Sent', 'Paid', 'Cancelled')) DEFAULT 'Draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update file_records to reference jobs
-- Note: This is a schema migration, previous job_id referenced enquiries.id
-- If you have existing data, you may need a more complex migration.
ALTER TABLE file_records 
  DROP CONSTRAINT IF EXISTS file_records_job_id_fkey,
  ADD CONSTRAINT file_records_job_id_fkey 
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL;

ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_job_id_fkey,
  ADD CONSTRAINT orders_job_id_fkey
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL;
