alter table turnos
add column if not exists cobertura_medica text default 'particular';
