-- ESPECIALIDADES
create table especialidades (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  duracion_turno integer not null default 30,
  activo boolean not null default true,
  created_at timestamptz default now()
);

-- PROFESIONALES
create table profesionales (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  activo boolean not null default true,
  created_at timestamptz default now()
);

-- PROFESIONAL_ESPECIALIDADES (tabla puente)
create table profesional_especialidades (
  id uuid default gen_random_uuid() primary key,
  profesional_id uuid references profesionales(id)
    on delete cascade,
  especialidad_id uuid references especialidades(id)
    on delete cascade,
  unique(profesional_id, especialidad_id)
);

-- DISPONIBILIDAD_BASE
create table disponibilidad_base (
  id uuid default gen_random_uuid() primary key,
  profesional_id uuid references profesionales(id)
    on delete cascade,
  dia_semana integer not null check (dia_semana between 0 and 5),
  hora_inicio time not null,
  hora_fin time not null,
  activo boolean not null default true
);

-- BLOQUEOS
create table bloqueos (
  id uuid default gen_random_uuid() primary key,
  profesional_id uuid references profesionales(id)
    on delete cascade null,
  fecha_inicio date not null,
  fecha_fin date not null,
  hora_inicio time null,
  hora_fin time null,
  motivo text,
  created_at timestamptz default now()
);

-- TURNOS
create table turnos (
  id uuid default gen_random_uuid() primary key,
  profesional_id uuid references profesionales(id),
  especialidad_id uuid references especialidades(id),
  paciente_nombre text not null,
  paciente_telefono text not null,
  fecha date not null,
  hora_inicio time not null,
  hora_fin time not null,
  estado text not null default 'confirmado'
    check (estado in ('confirmado','cancelado','ausente','completado')),
  notas text,
  created_at timestamptz default now()
);

-- ÍNDICES para performance
create index on turnos(fecha, profesional_id);
create index on disponibilidad_base(profesional_id);
create index on bloqueos(profesional_id, fecha_inicio, fecha_fin);

-- DATOS INICIALES de especialidades (las del sitio)
insert into especialidades (nombre) values
('Cardiología'),('Clínica médica'),('Cirujano general'),
('Dermatología'),('Diabetología'),('Endocrinología'),
('Endocrinología infantil'),('Ecografía y Doppler'),
('Flebología'),('Ginecología'),('Terapia ocupacional'),
('Obstetricia'),('Gastroenterología'),
('Gastroenterología infantil'),('Infectología'),
('Ortopedia'),('Neumonología'),('Neumonología infantil'),
('Neurología'),('Neurología infantil'),('Nutrición'),
('Otorrinolaringología'),('Pediatría'),('Proctología'),
('Psicología'),('Psicopedagogía'),('Psiquiatría adultos'),
('Psiquiatría infanto-juvenil'),('Traumatología'),
('Traumatología infantil'),('Urología'),
('Kinesiología'),('Audiología');
