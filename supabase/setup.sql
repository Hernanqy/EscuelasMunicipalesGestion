-- Educación Cultural Olavarría
-- Ejecutar una vez desde Supabase > SQL Editor.

create table if not exists public.education_schools (
  id text primary key,
  short_name text not null,
  name text not null,
  discipline text not null,
  locality text not null,
  address text not null,
  latitude double precision not null,
  longitude double precision not null,
  color text not null default '#155eef',
  workshops jsonb not null default '[]'::jsonb,
  schedule text not null default '',
  teachers jsonb not null default '[]'::jsonb,
  source text not null default 'Carga manual desde la aplicación',
  status text not null default 'verified' check (status in ('verified', 'review')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.education_schools enable row level security;
revoke all on table public.education_schools from anon, authenticated;
grant select on table public.education_schools to anon, authenticated;
grant insert, update, delete on table public.education_schools to authenticated;

drop policy if exists "education schools public read" on public.education_schools;
drop policy if exists "municipal users insert schools" on public.education_schools;
drop policy if exists "municipal users update schools" on public.education_schools;
drop policy if exists "municipal users delete schools" on public.education_schools;

create policy "education schools public read"
on public.education_schools for select
to anon, authenticated
using (true);

create policy "municipal users insert schools"
on public.education_schools for insert
to authenticated
with check (lower(coalesce(auth.jwt() ->> 'email', '')) like '%@olavarria.gov.ar');

create policy "municipal users update schools"
on public.education_schools for update
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) like '%@olavarria.gov.ar')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) like '%@olavarria.gov.ar');

create policy "municipal users delete schools"
on public.education_schools for delete
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) like '%@olavarria.gov.ar');

insert into public.education_schools
(id, short_name, name, discipline, locality, address, latitude, longitude, color, workshops, schedule, teachers, source, status, note)
values
('musica', 'Música', 'Escuela Municipal de Música Hermanos Rossi', 'Música', 'Olavarría', 'Coronel Suárez 2924', -36.8960449, -60.3230691, '#6d3df5', '["Guitarra","Canto","Piano","Batería","Violín","Flauta","Saxo","Bajo","Ensamble"]', 'Lunes a viernes, turnos de mañana y tarde', '["Tito Catani","Inés Maddio","José Saez","Ulises Merlos","Ruth Angeletti"]', 'Música Listado Talleres y Horarios Profesores Sede (1).xlsx', 'verified', null),
('plastica-olavarria', 'Plástica Olavarría', 'Escuela Municipal de Artes Plásticas Leopoldo Boccazzi', 'Artes visuales', 'Olavarría', 'Avenida Pringles 3045', -36.8961444, -60.3154449, '#e54b4b', '["Dibujo","Pintura artística","Escultura","Grabado","Plástica infantil","Ilustración y cómic"]', 'Lunes a viernes, de 15 a 20 h según taller', '["Mónica Zanazzi","Natalia Peralta","Aldo Fernández","Fernando García","Alfredo Puertas"]', 'Horarios Plástica Olavarría.jpeg', 'review', 'El archivo 2026 indica Pringles 3045; una ficha web municipal anterior conserva otra sede.'),
('ceramica-olavarria', 'Cerámica Olavarría', 'Escuela Municipal de Cerámica Víctor Portarrieu', 'Cerámica', 'Olavarría', 'Necochea 3328', -36.8954357, -60.315581, '#c66a2b', '["Cerámica inicial","Cerámica adultos"]', 'Miércoles y jueves de 14 a 19 h; viernes de 14 a 19 h', '["Karina García","Gisele Gaitero"]', 'Horario 2026 Cerámica Olavarría.pdf', 'verified', null),
('plastica-sierras', 'Plástica Sierras Bayas', 'Escuela Municipal de Artes Plásticas de Sierras Bayas', 'Artes visuales', 'Sierras Bayas', 'Alsina entre Roca y Almirante Brown', -36.93345, -60.1598, '#e54b4b', '["Taller infantil","Taller adolescentes","Taller adultos"]', 'Lunes a viernes, actividades de 15 a 22 h según taller', '["Elizabeth Taraborrelli","Martí Othasegui","Santiago Rey","Daniel Fitte"]', 'ok Plástica S Bayas HORARIOS TALLERES 2026.docx', 'verified', null),
('ceramica-sierras', 'Cerámica Sierras Bayas', 'Escuela Municipal de Cerámica de Sierras Bayas', 'Cerámica', 'Sierras Bayas', 'Alsina entre Roca y Almirante Brown', -36.93336, -60.15964, '#c66a2b', '["Adultos inicial","Adultos avanzados","Infancias"]', 'Lunes, martes, miércoles y viernes', '[]', 'Escuela Cerámica S Bayas.docx', 'review', 'El archivo no informa docentes.'),
('danza', 'Danza', 'Escuela Municipal de Danza', 'Danza y movimiento', 'Olavarría', 'Casa del Bicentenario, Bolívar y Cerrito', -36.8929228, -60.3306353, '#ed3f86', '["Folklore","Árabe","Danzas alemanas","Tap","Tango","Salsa y bachata","Danza urbana","Yoga"]', 'Propuestas de lunes a sábado en Olavarría y localidades', '["Delia Ortega","Esteban Salguero","Denisa Laborde","Aldana Espelet","Juan José Rivas"]', 'PROPUESTAS DANZA actualizada 05 2026.pdf', 'verified', null),
('teatro', 'Teatro', 'Escuela Municipal de Teatro Olavarría', 'Teatro', 'Olavarría', 'Teatro Municipal, Rivadavia y San Martín', -36.8940717, -60.3223747, '#1667cf', '["Teatro infancias","Teatro adolescentes","Teatro adultos","Impro teatral","Clown","Risoterapia"]', 'Lunes a viernes de 15 a 22 h; extensiones en localidades', '["Clara Chirino","Beatriz Peralta","Flavia Salto","Victoria Reyes","Julio Sarrat"]', 'ETO.pdf', 'verified', null),
('literaria', 'Literaria Alfonsina', 'Escuela Literaria Municipal Alfonsina', 'Literatura', 'Olavarría y localidades', 'Biblioteca Helios Eseverri, Balcarce 3620', -36.9048586, -60.3223235, '#0b8a70', '["Narrativa","Poesía","Literatura para niños","Literatura para adolescentes"]', 'Lunes a viernes en bibliotecas, museos y centros comunitarios', '["Ceferino Lascano","Mónica Pezzino","Nora Sollé","Marité Dillón","Lucrecia Luna"]', 'ok Horarios Escuela Literaria Alfonsina 2026.docx', 'verified', null),
('orfebreria', 'Orfebrería', 'Escuela de Orfebrería y Artesanías Tradicionales Maestro Armando Ferreira', 'Artesanías', 'Olavarría', 'Bolívar 3332', -36.9000702, -60.3213664, '#697380', '["Orfebrería","Tallado en madera","Marroquinería","Cestería","Telar","Soguería"]', 'Lunes a viernes, turnos de mañana, tarde y noche', '["Juan Ángel Chasman","Ezequiel Burnet","Martín Rossi","Alicia Frías","Raúl Elizaga"]', 'ok horarios 2026 Escuela de Orfebrería.docx', 'verified', null),
('integrada', 'Artística Integrada', 'Escuela Municipal Artística Integrada', 'Arte integrado', 'Olavarría', 'Centro Cultural San José, Riobamba 2949', -36.8893485, -60.3254393, '#1d83a5', '["Danza","Teatro","Plástica","Tridimensión","Música"]', 'Actividades semanales en instituciones y espacios culturales', '["Lorena Torres","Javier Magnani","Mauricio Gogorza","Valeria González","Antonella Spinolla"]', 'Horarios Esc Artistica Integrada 2025.xls', 'review', 'El único cronograma del ZIP corresponde a 2025 y necesita actualización.'),
('ajedrez', 'Ajedrez', 'Escuela Municipal de Ajedrez', 'Ajedrez', 'Olavarría y localidades', 'Museo de las Ciencias, avenida Pellegrini 4200', -36.8976482, -60.2960112, '#203354', '["Ajedrez inicial","Ajedrez adultos","Ajedrez en escuelas","Ajedrez en clubes"]', 'Actividades de lunes a sábado en más de 20 sedes', '["Darío Maidana","Paola Nievas","Omar Navarro","Juan Rodríguez","Lautaro Sampaoli"]', 'horario Ajedrez 2026 (1).xlsx', 'verified', null)
on conflict (id) do update set
  short_name = excluded.short_name,
  name = excluded.name,
  discipline = excluded.discipline,
  locality = excluded.locality,
  address = excluded.address,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  color = excluded.color,
  workshops = excluded.workshops,
  schedule = excluded.schedule,
  teachers = excluded.teachers,
  source = excluded.source,
  status = excluded.status,
  note = excluded.note,
  updated_at = now();
