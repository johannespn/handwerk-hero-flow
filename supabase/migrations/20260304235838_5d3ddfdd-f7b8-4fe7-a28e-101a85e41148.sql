
CREATE TABLE public.recruitment_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL,
  trade_type TEXT NOT NULL,
  qualification TEXT NOT NULL,
  benefits_selected TEXT[] NOT NULL DEFAULT '{}',
  availability TEXT NOT NULL,
  candidate_name TEXT NOT NULL,
  candidate_phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.recruitment_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
  ON public.recruitment_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read leads"
  ON public.recruitment_leads
  FOR SELECT
  TO authenticated
  USING (true);
