# Recruitment Wizard — Drop-in Component

A 5-step animated recruitment wizard. Collects qualification, desired benefits, availability, and contact details, then inserts a lead into Supabase.

## Install

```bash
npx shadcn@latest add https://raw.githubusercontent.com/johannespn/handwerk-hero-flow/main/public/registry/recruitment-wizard.json
```

The CLI will install all files under `components/recruitment/`, add the required CSS variables, and extend your Tailwind config automatically.

## Required Supabase table

```sql
create table public.recruitment_leads (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  trade_type text not null,
  qualification text not null,
  benefits_selected text[] not null default '{}',
  availability text not null,
  candidate_name text not null,
  candidate_phone text not null,
  created_at timestamptz not null default now()
);

-- allow anonymous inserts
alter table public.recruitment_leads enable row level security;
create policy "anon insert" on public.recruitment_leads for insert with check (true);
```

## Usage

```tsx
import { RecruitmentWizard } from "@/components/recruitment/RecruitmentWizard";
import { supabase } from "@/integrations/supabase/client";

export default function Page() {
  return (
    <RecruitmentWizard
      clientId="acme-gmbh"
      tradeType="Elektriker"
      supabaseClient={supabase}
    />
  );
}
```

| Prop | Type | Description |
|------|------|-------------|
| `clientId` | `string` | Identifies the hiring company in the DB |
| `tradeType` | `string` | Job title shown to the candidate (e.g. `"Elektriker"`) |
| `supabaseClient` | `SupabaseClient` | Your project's Supabase client instance |

## Lovable agent prompt snippet

Paste this into your Lovable project prompt to have the agent wire everything up:

```
Install the recruitment wizard drop-in component:

  npx shadcn@latest add https://raw.githubusercontent.com/johannespn/handwerk-hero-flow/main/public/registry/recruitment-wizard.json

Create the `recruitment_leads` table in Supabase (columns: id uuid pk, client_id text, trade_type text, qualification text, benefits_selected text[], availability text, candidate_name text, candidate_phone text, created_at timestamptz). Enable RLS and allow anonymous inserts.

On the main landing page, render:
  <RecruitmentWizard clientId="<CLIENT_ID>" tradeType="<TRADE>" supabaseClient={supabase} />
```

## Keeping the registry in sync

After editing any component under `src/components/recruitment/`, regenerate the registry JSON:

```bash
npm run build:registry
```

Then commit and push — the raw GitHub URL serves the updated file immediately.
