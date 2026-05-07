-- ENUMS
CREATE TYPE user_role AS ENUM ('CEO', 'GM', 'Manager', 'SDR', 'Designer', 'QA', 'Production', 'Admin');
CREATE TYPE lead_status AS ENUM ('New', 'Contacted', 'Qualified', 'Invoice_Sent', 'Won', 'Lost');
CREATE TYPE order_status AS ENUM ('Awaiting_Payment', 'Design', 'Production', 'QA', 'Shipping', 'Delivered', 'Cancelled');
CREATE TYPE quote_status AS ENUM ('Draft', 'Sent', 'Accepted', 'Rejected', 'Expired');
CREATE TYPE invoice_status AS ENUM ('Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled');
CREATE TYPE production_status AS ENUM ('Queued', 'In_Production', 'Finishing', 'Ready', 'Shipped_To_QA', 'Completed');
CREATE TYPE design_status AS ENUM ('Pending', 'In_Progress', 'Awaiting_Approval', 'Revision', 'Approved');
CREATE TYPE qa_status AS ENUM ('Pending', 'In_Progress', 'Passed', 'Failed');
CREATE TYPE shipment_status AS ENUM ('Label_Created', 'Picked_Up', 'In_Transit', 'Delivered', 'Exception');
CREATE TYPE integration_type AS ENUM ('stripe', 'fedex', 'dhl', 'ups', 'ringcentral', 'gmail', 'tawkto');
CREATE TYPE message_sender_type AS ENUM ('staff', 'customer', 'system');
CREATE TYPE conversation_channel AS ENUM ('email', 'chat', 'phone', 'internal');
CREATE TYPE priority_level AS ENUM ('Low', 'Medium', 'High', 'Urgent');

-- TABLES

CREATE TABLE brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  currency text NOT NULL,
  domain text,
  country text,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  role user_role,
  brand_ids uuid[] DEFAULT '{}'::uuid[],
  active_brand_id uuid REFERENCES brands(id),
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  company text,
  country text,
  notes text,
  lifetime_value numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  display_id text NOT NULL,
  customer_id uuid REFERENCES customers(id),
  source text,
  channel conversation_channel,
  assigned_sdr_id uuid REFERENCES profiles(id),
  status lead_status DEFAULT 'New',
  priority priority_level DEFAULT 'Medium',
  sla_deadline timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  lead_id uuid REFERENCES leads(id),
  customer_id uuid REFERENCES customers(id),
  channel conversation_channel,
  subject text,
  is_resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_type message_sender_type,
  sender_id uuid, -- FK to profiles if staff, nullable if customer/system
  body text,
  attachments jsonb[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  display_id text NOT NULL,
  lead_id uuid REFERENCES leads(id),
  customer_id uuid REFERENCES customers(id),
  items jsonb[] DEFAULT '{}',
  subtotal numeric DEFAULT 0,
  tax numeric DEFAULT 0,
  total numeric DEFAULT 0,
  currency text,
  status quote_status DEFAULT 'Draft',
  valid_until timestamptz,
  pdf_url text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  display_id text NOT NULL,
  quote_id uuid REFERENCES quotes(id),
  customer_id uuid REFERENCES customers(id),
  status order_status DEFAULT 'Awaiting_Payment',
  total numeric DEFAULT 0,
  currency text,
  specs jsonb DEFAULT '{}'::jsonb,
  artwork_files jsonb[] DEFAULT '{}',
  assigned_designer_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  patch_type text,
  size text,
  backing text,
  colors integer,
  effects text[],
  quantity integer,
  unit_price numeric,
  notes text
);

CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  display_id text NOT NULL,
  order_id uuid REFERENCES orders(id),
  amount numeric DEFAULT 0,
  currency text,
  status invoice_status DEFAULT 'Draft',
  stripe_invoice_id text,
  paid_at timestamptz,
  due_date timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE production_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  display_id text NOT NULL,
  order_id uuid REFERENCES orders(id),
  assigned_to_id uuid REFERENCES profiles(id),
  status production_status DEFAULT 'Queued',
  design_file_url text,
  specs jsonb DEFAULT '{}'::jsonb,
  quantity integer,
  due_date timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE design_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  order_id uuid REFERENCES orders(id),
  designer_id uuid REFERENCES profiles(id),
  status design_status DEFAULT 'Pending',
  versions jsonb[] DEFAULT '{}',
  current_version integer DEFAULT 1,
  customer_feedback text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE qa_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  production_job_id uuid REFERENCES production_jobs(id),
  inspector_id uuid REFERENCES profiles(id),
  status qa_status DEFAULT 'Pending',
  checklist jsonb DEFAULT '[]'::jsonb,
  photos jsonb[] DEFAULT '{}',
  overall_notes text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  order_id uuid REFERENCES orders(id),
  carrier text,
  tracking_number text,
  status shipment_status DEFAULT 'Label_Created',
  estimated_delivery timestamptz,
  status_history jsonb[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id),
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  type integration_type NOT NULL,
  display_name text,
  config jsonb DEFAULT '{}'::jsonb,
  is_enabled boolean DEFAULT false,
  last_synced_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE (brand_id, type)
);

CREATE TABLE id_counters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  entity_type text NOT NULL,
  last_number integer DEFAULT 0,
  UNIQUE (brand_id, entity_type)
);

-- FUNCTION FOR ID GENERATION
CREATE OR REPLACE FUNCTION generate_display_id(p_brand_id uuid, p_entity_type text)
RETURNS text AS $$
DECLARE
  v_brand_code text;
  v_next_number integer;
  v_prefix text;
BEGIN
  -- Get brand code
  SELECT code INTO v_brand_code FROM brands WHERE id = p_brand_id;
  
  -- Determine prefix based on entity
  CASE p_entity_type
    WHEN 'lead' THEN v_prefix := '-LD-';
    WHEN 'quote' THEN v_prefix := '-QT-';
    WHEN 'order' THEN v_prefix := '-ORD-';
    WHEN 'invoice' THEN v_prefix := '-INV-';
    WHEN 'production_job' THEN v_prefix := '-PJ-';
    ELSE v_prefix := '-' || upper(substring(p_entity_type, 1, 3)) || '-';
  END CASE;

  -- Increment or insert counter
  INSERT INTO id_counters (brand_id, entity_type, last_number)
  VALUES (p_brand_id, p_entity_type, 1)
  ON CONFLICT (brand_id, entity_type)
  DO UPDATE SET last_number = id_counters.last_number + 1
  RETURNING last_number INTO v_next_number;

  RETURN v_brand_code || v_prefix || lpad(v_next_number::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- INDEXES
CREATE INDEX idx_customers_brand_id ON customers(brand_id);
CREATE INDEX idx_leads_brand_id_status ON leads(brand_id, status);
CREATE INDEX idx_conversations_brand_id ON conversations(brand_id);
CREATE INDEX idx_quotes_brand_id ON quotes(brand_id);
CREATE INDEX idx_orders_brand_id_status ON orders(brand_id, status);
CREATE INDEX idx_invoices_brand_id ON invoices(brand_id);
CREATE INDEX idx_production_jobs_brand_id_status ON production_jobs(brand_id, status);
CREATE INDEX idx_design_tasks_brand_id ON design_tasks(brand_id);
CREATE INDEX idx_qa_reports_brand_id ON qa_reports(brand_id);
CREATE INDEX idx_shipments_brand_id ON shipments(brand_id);
CREATE INDEX idx_activity_log_brand_id ON activity_log(brand_id);

-- RLS POLICIES

-- Enable RLS on all tables
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE id_counters ENABLE ROW LEVEL SECURITY;

-- Brands: Users can only see brands they are assigned to, or all if Admin/CEO
CREATE POLICY "brands_isolation_select" ON brands
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('Admin', 'CEO') OR
    id IN (SELECT unnest(brand_ids) FROM profiles WHERE id = auth.uid())
  );

-- Profiles: Users can read their own profile, Admins/GMs can read all
CREATE POLICY "profiles_isolation_select" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('Admin', 'GM', 'CEO')
  );

-- Function to get active brand id for RLS
CREATE OR REPLACE FUNCTION current_user_brand_id()
RETURNS uuid AS $$
  SELECT active_brand_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE;

-- Macro to create isolation policies for a table
DO $$
DECLARE
  t text;
  tables text[] := ARRAY['customers', 'leads', 'conversations', 'quotes', 'orders', 'invoices', 'production_jobs', 'design_tasks', 'qa_reports', 'shipments', 'activity_log', 'integrations', 'id_counters'];
BEGIN
  FOREACH t IN ARRAY tables
  LOOP
    EXECUTE format('
      CREATE POLICY "%I_brand_isolation_select" ON %I
        FOR SELECT USING (brand_id = current_user_brand_id());
      CREATE POLICY "%I_brand_isolation_insert" ON %I
        FOR INSERT WITH CHECK (brand_id = current_user_brand_id());
      CREATE POLICY "%I_brand_isolation_update" ON %I
        FOR UPDATE USING (brand_id = current_user_brand_id());
      CREATE POLICY "%I_brand_isolation_delete" ON %I
        FOR DELETE USING (brand_id = current_user_brand_id());
    ', t, t, t, t, t, t, t, t);
  END LOOP;
END;
$$;

-- Messages: Inherit from conversations
CREATE POLICY "messages_isolation_select" ON messages
  FOR SELECT USING (
    conversation_id IN (SELECT id FROM conversations WHERE brand_id = current_user_brand_id())
  );
CREATE POLICY "messages_isolation_insert" ON messages
  FOR INSERT WITH CHECK (
    conversation_id IN (SELECT id FROM conversations WHERE brand_id = current_user_brand_id())
  );

-- Order Items: Inherit from orders
CREATE POLICY "order_items_isolation_select" ON order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE brand_id = current_user_brand_id())
  );
CREATE POLICY "order_items_isolation_insert" ON order_items
  FOR INSERT WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE brand_id = current_user_brand_id())
  );
CREATE POLICY "order_items_isolation_update" ON order_items
  FOR UPDATE USING (
    order_id IN (SELECT id FROM orders WHERE brand_id = current_user_brand_id())
  );
CREATE POLICY "order_items_isolation_delete" ON order_items
  FOR DELETE USING (
    order_id IN (SELECT id FROM orders WHERE brand_id = current_user_brand_id())
  );
