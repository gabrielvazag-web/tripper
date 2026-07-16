-- Tripper — schema, RLS e funções pra viagens compartilhadas.
-- Rodar uma vez no SQL Editor do projeto Supabase.

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  data jsonb not null
);

create table if not exists public.trip_members (
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'editor',
  created_at timestamptz not null default now(),
  primary key (trip_id, user_id)
);

create table if not exists public.trip_invites (
  token uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  created_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  redeemed_by uuid references auth.users(id),
  redeemed_at timestamptz
);

alter table public.trips enable row level security;
alter table public.trip_members enable row level security;
alter table public.trip_invites enable row level security;

-- trips: só membros leem/atualizam. Criação sempre passa pela função create_trip.
create policy "members can select trips" on public.trips
  for select to authenticated using (
    exists (select 1 from public.trip_members m where m.trip_id = trips.id and m.user_id = auth.uid())
  );

create policy "members can update trips" on public.trips
  for update to authenticated using (
    exists (select 1 from public.trip_members m where m.trip_id = trips.id and m.user_id = auth.uid())
  );

-- trip_members: cada um só vê a própria linha. Nunca dá insert direto pelo client
-- (só via create_trip/redeem_invite, que rodam como security definer) — evita
-- alguém se auto-adicionar a uma viagem só sabendo o trip_id.
create policy "user can select own membership" on public.trip_members
  for select to authenticated using (user_id = auth.uid());

-- trip_invites: só membro da viagem pode gerar convite; o token (UUID aleatório)
-- já funciona como segredo, então leitura por token é liberada.
create policy "members can create invites" on public.trip_invites
  for insert to authenticated with check (
    exists (select 1 from public.trip_members m where m.trip_id = trip_invites.trip_id and m.user_id = auth.uid())
  );

create policy "anyone authenticated can read an invite by token" on public.trip_invites
  for select to authenticated using (true);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trips_set_updated_at on public.trips;
create trigger trips_set_updated_at
  before update on public.trips
  for each row execute function public.set_updated_at();

-- Cria a viagem + a membership do dono numa transação só.
create or replace function public.create_trip(trip_data jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  insert into public.trips (owner_id, data) values (auth.uid(), trip_data) returning id into new_id;
  insert into public.trip_members (trip_id, user_id, role) values (new_id, auth.uid(), 'owner');
  return new_id;
end;
$$;

-- Preview do convite (nome da viagem) sem exigir sessão/membership ainda.
create or replace function public.get_invite_preview(invite_token uuid)
returns table(destino text, titulo text)
language sql
security definer
set search_path = public
as $$
  select data->'meta'->>'destino' as destino, data->'meta'->>'titulo' as titulo
  from public.trips
  join public.trip_invites on trip_invites.trip_id = trips.id
  where trip_invites.token = invite_token
    and trip_invites.redeemed_at is null;
$$;

-- Único caminho pra entrar em trip_members via convite.
create or replace function public.redeem_invite(invite_token uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_trip uuid;
begin
  select trip_id into target_trip
  from public.trip_invites
  where token = invite_token and redeemed_at is null;

  if target_trip is null then
    raise exception 'Convite inválido ou já utilizado';
  end if;

  insert into public.trip_members (trip_id, user_id, role)
  values (target_trip, auth.uid(), 'editor')
  on conflict (trip_id, user_id) do nothing;

  update public.trip_invites
    set redeemed_by = auth.uid(), redeemed_at = now()
    where token = invite_token;

  return target_trip;
end;
$$;

grant execute on function public.create_trip(jsonb) to authenticated;
grant execute on function public.redeem_invite(uuid) to authenticated;
grant execute on function public.get_invite_preview(uuid) to anon, authenticated;

alter publication supabase_realtime add table public.trips;
