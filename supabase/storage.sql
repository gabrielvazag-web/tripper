-- Tripper — bucket e políticas pra anexos (fotos/PDFs) compartilhados por viagem.
-- Rodar uma vez no SQL Editor do projeto Supabase (depois do schema.sql).

insert into storage.buckets (id, name, public)
values ('anexos', 'anexos', false)
on conflict (id) do nothing;

-- Caminho dos arquivos: <trip_id>/<uuid>/<nome-original>.
-- storage.foldername(name) devolve os segmentos de pasta; o [1] é o trip_id.
create policy "members can read trip attachments"
on storage.objects for select
to authenticated
using (
  bucket_id = 'anexos'
  and exists (
    select 1 from public.trip_members m
    where m.user_id = auth.uid()
      and m.trip_id::text = (storage.foldername(name))[1]
  )
);

create policy "members can upload trip attachments"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'anexos'
  and exists (
    select 1 from public.trip_members m
    where m.user_id = auth.uid()
      and m.trip_id::text = (storage.foldername(name))[1]
  )
);

create policy "members can delete trip attachments"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'anexos'
  and exists (
    select 1 from public.trip_members m
    where m.user_id = auth.uid()
      and m.trip_id::text = (storage.foldername(name))[1]
  )
);
