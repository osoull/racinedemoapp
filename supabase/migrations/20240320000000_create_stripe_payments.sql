create table if not exists stripe_payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  transaction_id uuid references transactions(id),
  stripe_session_id text not null,
  amount numeric not null,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Ajouter les politiques RLS
alter table stripe_payments enable row level security;

-- Les utilisateurs peuvent voir leurs propres paiements
create policy "Users can view their own payments"
  on stripe_payments for select
  using (auth.uid() = user_id);

-- Les administrateurs peuvent tout voir
create policy "Admins can manage all payments"
  on stripe_payments for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.user_type = 'admin'
    )
  );