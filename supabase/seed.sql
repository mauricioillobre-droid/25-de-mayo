-- =============================================================
-- SEED: Profesionales del Centro Médico 25 de Mayo
-- =============================================================
-- Requisito: ejecutar schema.sql primero.
-- Las columnas duracion_turno/edad_minima/edad_maxima/notas en
-- profesionales y frecuencia en disponibilidad_base deben
-- existir (se crean con los ALTER TABLE a continuación si no).
-- =============================================================

-- ── 0. Columnas agregadas por la actualización del panel admin
ALTER TABLE profesionales
  ADD COLUMN IF NOT EXISTS duracion_turno integer NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS edad_minima    integer,
  ADD COLUMN IF NOT EXISTS edad_maxima    integer,
  ADD COLUMN IF NOT EXISTS notas          text;

ALTER TABLE disponibilidad_base
  ADD COLUMN IF NOT EXISTS frecuencia text NOT NULL DEFAULT 'semanal';

-- ── 1. Especialidades faltantes ──────────────────────────────
INSERT INTO especialidades (nombre)
VALUES ('Depilación definitiva')
ON CONFLICT DO NOTHING;

-- ── 2. Profesionales, relaciones y disponibilidad ────────────
-- Usa un bloque DO para capturar los IDs generados por cada INSERT.
-- dia_semana: 0=Lun 1=Mar 2=Mié 3=Jue 4=Vie 5=Sáb
-- frecuencia: semanal | quincenal_1 | quincenal_2 |
--             mensual_1 | mensual_2 | mensual_3 | mensual_4

DO $$
DECLARE
  -- IDs de especialidades
  esp_audiologia        uuid;
  esp_cardiologia       uuid;
  esp_cirugia           uuid;
  esp_clinica           uuid;
  esp_depilacion        uuid;
  esp_dermatologia      uuid;
  esp_diabetologia      uuid;
  esp_ecografia         uuid;
  esp_endocrinologia    uuid;
  esp_endo_infantil     uuid;
  esp_flebologia        uuid;
  esp_gastro            uuid;
  esp_gastro_inf        uuid;
  esp_ginecologia       uuid;
  esp_infectologia      uuid;
  esp_kinesiologia      uuid;
  esp_neurologia        uuid;
  esp_neuro_inf         uuid;
  esp_neumo             uuid;
  esp_neumo_inf         uuid;
  esp_nutricion         uuid;
  esp_obstetricia       uuid;
  esp_ortopedia         uuid;
  esp_otorrino          uuid;
  esp_pediatria         uuid;
  esp_proctologia       uuid;
  esp_psicologia        uuid;
  esp_psicopedagogia    uuid;
  esp_psiquiatria       uuid;
  esp_psiq_infantil     uuid;
  esp_terapia_oc        uuid;
  esp_traumatologia     uuid;
  esp_urologia          uuid;

  -- ID reutilizable para cada profesional
  pid uuid;

BEGIN
  -- Obtener IDs de especialidades por nombre
  SELECT id INTO esp_audiologia        FROM especialidades WHERE nombre = 'Audiología';
  SELECT id INTO esp_cardiologia       FROM especialidades WHERE nombre = 'Cardiología';
  SELECT id INTO esp_cirugia           FROM especialidades WHERE nombre = 'Cirujano general';
  SELECT id INTO esp_clinica           FROM especialidades WHERE nombre = 'Clínica médica';
  SELECT id INTO esp_depilacion        FROM especialidades WHERE nombre = 'Depilación definitiva';
  SELECT id INTO esp_dermatologia      FROM especialidades WHERE nombre = 'Dermatología';
  SELECT id INTO esp_diabetologia      FROM especialidades WHERE nombre = 'Diabetología';
  SELECT id INTO esp_ecografia         FROM especialidades WHERE nombre = 'Ecografía y Doppler';
  SELECT id INTO esp_endocrinologia    FROM especialidades WHERE nombre = 'Endocrinología';
  SELECT id INTO esp_endo_infantil     FROM especialidades WHERE nombre = 'Endocrinología infantil';
  SELECT id INTO esp_flebologia        FROM especialidades WHERE nombre = 'Flebología';
  SELECT id INTO esp_gastro            FROM especialidades WHERE nombre = 'Gastroenterología';
  SELECT id INTO esp_gastro_inf        FROM especialidades WHERE nombre = 'Gastroenterología infantil';
  SELECT id INTO esp_ginecologia       FROM especialidades WHERE nombre = 'Ginecología';
  SELECT id INTO esp_infectologia      FROM especialidades WHERE nombre = 'Infectología';
  SELECT id INTO esp_kinesiologia      FROM especialidades WHERE nombre = 'Kinesiología';
  SELECT id INTO esp_neurologia        FROM especialidades WHERE nombre = 'Neurología';
  SELECT id INTO esp_neuro_inf         FROM especialidades WHERE nombre = 'Neurología infantil';
  SELECT id INTO esp_neumo             FROM especialidades WHERE nombre = 'Neumonología';
  SELECT id INTO esp_neumo_inf         FROM especialidades WHERE nombre = 'Neumonología infantil';
  SELECT id INTO esp_nutricion         FROM especialidades WHERE nombre = 'Nutrición';
  SELECT id INTO esp_obstetricia       FROM especialidades WHERE nombre = 'Obstetricia';
  SELECT id INTO esp_ortopedia         FROM especialidades WHERE nombre = 'Ortopedia';
  SELECT id INTO esp_otorrino          FROM especialidades WHERE nombre = 'Otorrinolaringología';
  SELECT id INTO esp_pediatria         FROM especialidades WHERE nombre = 'Pediatría';
  SELECT id INTO esp_proctologia       FROM especialidades WHERE nombre = 'Proctología';
  SELECT id INTO esp_psicologia        FROM especialidades WHERE nombre = 'Psicología';
  SELECT id INTO esp_psicopedagogia    FROM especialidades WHERE nombre = 'Psicopedagogía';
  SELECT id INTO esp_psiquiatria       FROM especialidades WHERE nombre = 'Psiquiatría adultos';
  SELECT id INTO esp_psiq_infantil     FROM especialidades WHERE nombre = 'Psiquiatría infanto-juvenil';
  SELECT id INTO esp_terapia_oc        FROM especialidades WHERE nombre = 'Terapia ocupacional';
  SELECT id INTO esp_traumatologia     FROM especialidades WHERE nombre = 'Traumatología';
  SELECT id INTO esp_urologia          FROM especialidades WHERE nombre = 'Urología';

  -- ── AUDIOLOGÍA ─────────────────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Lic. Larraburu Analia', 15, NULL, NULL, 'Jueves cada 15 días de 15 a 17:30hs')
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_audiologia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 3, '15:00', '17:30', true, 'quincenal_1');

  -- ── CARDIOLOGÍA ────────────────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dr. Morelli Néstor', 10, 6, NULL, 'Miércoles cada 15 días y Sábados cada 15 días')
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_cardiologia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia) VALUES
    (pid, 2, '09:00', '11:00', true, 'quincenal_1'),
    (pid, 5, '09:00', '13:00', true, 'quincenal_1');

  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Rey Brinda', 10, 10, NULL,
          'Viernes cada 15 días 14-18hs O Martes cada 15 días 8-10hs. Turnos cada 10 o 20 min')
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES
    (pid, esp_cardiologia),
    (pid, esp_ecografia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia) VALUES
    (pid, 4, '14:00', '18:00', true, 'quincenal_1'),
    (pid, 1, '08:00', '10:00', true, 'quincenal_1');

  -- ── CLÍNICA MÉDICA / DIABETOLOGÍA / ENDOCRINOLOGÍA ─────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dr. Perea Juan', 20, 17, NULL, 'Atiende Clínica médica, Diabetología y Endocrinología')
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES
    (pid, esp_clinica),
    (pid, esp_diabetologia),
    (pid, esp_endocrinologia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 4, '09:00', '11:30', true, 'semanal');

  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dr. Orloff Matias', 20, 14, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_clinica);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia) VALUES
    (pid, 2, '15:20', '18:00', true, 'semanal'),
    (pid, 3, '15:20', '18:00', true, 'semanal');

  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Acevedo Evelin', 15, 14, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES
    (pid, esp_clinica),
    (pid, esp_ginecologia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 5, '09:00', '13:00', true, 'semanal');

  -- ── DEPILACIÓN DEFINITIVA ───────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Tec. Leiva Monica', 30, 16, NULL, '1 vez por mes, Lunes o Jueves de 9 a 19hs')
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_depilacion);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 0, '09:00', '19:00', true, 'mensual_1');

  -- ── DERMATOLOGÍA ───────────────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dr. Gorodner Juan', 10, NULL, NULL,
          'Viernes 12:30-14hs aprox. Atiende por orden de llegada, todos agendan a las 12:30')
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_dermatologia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 4, '12:30', '14:00', true, 'semanal');

  -- ── ECOGRAFÍA Y DOPPLER ────────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dr. Baño Christian', 10, NULL, NULL, 'Atiende por orden de llegada con turno')
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_ecografia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 1, '09:00', '11:30', true, 'semanal');

  -- ── FLEBOLOGÍA / PROCTOLOGÍA / CIRUGÍA ─────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dr. Burgos Hugo', 30, 17, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES
    (pid, esp_flebologia),
    (pid, esp_proctologia),
    (pid, esp_cirugia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 1, '09:00', '12:30', true, 'semanal');

  -- ── ENDOCRINOLOGÍA INFANTIL / PEDIATRÍA ────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Moreyra Daiana', 20, 0, 18, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES
    (pid, esp_endo_infantil),
    (pid, esp_pediatria);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 1, '13:00', '18:00', true, 'quincenal_1');

  -- ── ENDOCRINOLOGÍA Y DIABETOLOGÍA ──────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dr. Pascuarelli Pablo', 15, 17, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES
    (pid, esp_endocrinologia),
    (pid, esp_diabetologia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 2, '14:00', '18:00', true, 'semanal');

  -- ── EVALUACIÓN NEUROCOGNITIVA ───────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Lic. Diz Cecilia', 60, 3, NULL, 'Evaluación neurocognitiva/test')
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_neurologia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia) VALUES
    (pid, 0, '16:30', '18:30', true, 'semanal'),
    (pid, 5, '09:00', '13:00', true, 'semanal');

  -- ── GASTROENTEROLOGÍA ──────────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dr. Monjes Mariano', 20, 17, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_gastro);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 0, '08:30', '12:00', true, 'quincenal_1');

  -- ── GASTROENTEROLOGÍA INFANTIL ─────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dr. Patiño Oscar', 15, 0, 17, '1 Jueves por mes')
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES
    (pid, esp_gastro_inf),
    (pid, esp_pediatria);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 3, '16:00', '18:00', true, 'mensual_1');

  -- ── GINECOLOGÍA ────────────────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Cava Natalia', 15, 15, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_ginecologia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia) VALUES
    (pid, 0, '14:00', '16:30', true, 'semanal'),
    (pid, 1, '13:00', '16:00', true, 'semanal');

  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Grijalba Chiara', 15, 15, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES
    (pid, esp_ginecologia),
    (pid, esp_obstetricia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 3, '14:30', '18:00', true, 'quincenal_1');

  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Orzusa Vilma', 15, 15, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES
    (pid, esp_ginecologia),
    (pid, esp_obstetricia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 0, '17:00', '19:00', true, 'semanal');

  -- ── INFECTOLOGÍA ───────────────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Carriazo Liz', 30, 15, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES
    (pid, esp_infectologia),
    (pid, esp_clinica);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 3, '16:00', '18:00', true, 'semanal');

  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Arbizu Gladis', 30, 15, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES
    (pid, esp_infectologia),
    (pid, esp_clinica);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 1, '15:30', '18:00', true, 'semanal');

  -- ── KINESIOLOGÍA ───────────────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Lic. Arancibia Matias', 60, 10, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_kinesiologia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia) VALUES
    (pid, 0, '08:00', '13:00', true, 'semanal'),
    (pid, 2, '08:00', '13:00', true, 'semanal');

  -- ── MÉDICA GENERALISTA ─────────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Montoya Florencia', 15, 14, NULL, 'Médica generalista y familiar')
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_clinica);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 2, '16:00', '18:00', true, 'semanal');

  -- ── NEUROLOGÍA ─────────────────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Gutierrez Silvia', 20, 16, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_neurologia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 3, '14:40', '18:00', true, 'semanal');

  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Arto Mariela', 30, 16, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_neurologia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 1, '14:00', '16:30', true, 'quincenal_1');

  -- ── NEUROLOGÍA INFANTIL ────────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Gutte Pamela', 15, 0, 16, '1 Jueves por mes')
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_neuro_inf);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 3, '15:20', '18:00', true, 'mensual_1');

  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Moreno Xiomara', 30, 0, 16, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_neuro_inf);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 4, '09:00', '17:00', true, 'semanal');

  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Subieta Dania', 20, 0, 16, '1 Lunes por mes, horario variable 13-15 o 15-18')
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_neuro_inf);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 0, '13:00', '18:00', true, 'mensual_1');

  -- ── NEUMONOLOGÍA ───────────────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Orozco Katiuska', 15, 16, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES
    (pid, esp_neumo),
    (pid, esp_clinica);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 0, '17:00', '19:00', true, 'semanal');

  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Pla Katiana', 20, 0, 18, '1 Viernes por mes, espirometrías todas las edades')
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_neumo_inf);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 4, '08:30', '15:30', true, 'mensual_1');

  -- ── NUTRICIÓN ──────────────────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Lic. Campagna Fabiana', 20, NULL, NULL, 'Atiende OSDE, SANCOR, MEDIFÉ y OMINT')
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_nutricion);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 0, '16:00', '18:00', true, 'semanal');

  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Lic. Mania Silvana', 20, NULL, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_nutricion);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 3, '13:20', '15:00', true, 'semanal');

  -- ── OTORRINOLARINGOLOGÍA ───────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dr. De Boeck Sebastian', 10, NULL, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_otorrino);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 1, '14:00', '15:30', true, 'semanal');

  -- ── PEDIATRÍA ──────────────────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Almara Debora', 20, 0, 15, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_pediatria);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 2, '14:00', '18:00', true, 'semanal');

  -- Sin días fijos: solo se registra el profesional
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Montesdeoca Jacqueline', 20, 0, 15, 'Aún no cuenta con días fijos')
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_pediatria);

  -- ── PSICOLOGÍA ─────────────────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Lic. Romer Ramos Hildimar', 30, 6, NULL, 'Psicología infantil, también atiende adultos')
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_psicologia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 1, '10:00', '16:00', true, 'semanal');

  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Lic. Iñiguez Mariella', 45, 12, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_psicologia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia) VALUES
    (pid, 0, '09:30', '13:00', true, 'semanal'),
    (pid, 3, '09:30', '12:00', true, 'semanal'),
    (pid, 4, '13:40', '17:30', true, 'semanal'),
    (pid, 5, '09:00', '13:00', true, 'semanal');

  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Lic. Monteiro Lucero', 45, 10, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_psicologia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia) VALUES
    (pid, 2, '08:15', '14:00', true, 'semanal'),
    (pid, 4, '08:15', '12:00', true, 'semanal');

  -- ── PSICOPEDAGOGÍA ─────────────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Lic. Valiente Cintia', 30, 6, 16, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_psicopedagogia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 2, '10:00', '15:00', true, 'semanal');

  -- ── PSIQUIATRÍA ────────────────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Alvarez Puello Melissa', 20, 17, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_psiquiatria);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 4, '15:00', '18:00', true, 'semanal');

  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Sarmiento Dina', 20, 17, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_psiquiatria);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia) VALUES
    (pid, 0, '13:00', '16:00', true, 'quincenal_1'),
    (pid, 1, '15:30', '18:00', true, 'semanal');

  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Dumrauf Camila', 20, 15, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_psiquiatria);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia) VALUES
    (pid, 2, '13:30', '16:30', true, 'semanal'),
    (pid, 5, '09:00', '13:00', true, 'semanal');

  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Bonilla Monserrate', 20, 17, NULL, '1 Sábado por mes')
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_psiquiatria);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 5, '09:00', '13:00', true, 'mensual_1');

  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Gaitan Tatiana', 15, NULL, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES
    (pid, esp_psiquiatria),
    (pid, esp_psiq_infantil);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 5, '09:00', '13:00', true, 'semanal');

  -- ── EEG / ESTUDIOS DE SUEÑO ────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Tec. Chavez Carolina', 30, NULL, NULL, '1 Martes por mes. EEG/PEAT estudios de sueño')
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_neurologia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 1, '09:00', '13:00', true, 'mensual_1');

  -- ── TERAPIA OCUPACIONAL ────────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Lic. Ameneiro Maria Sol', 45, 3, 18, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_terapia_oc);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 0, '08:00', '13:00', true, 'semanal');

  -- ── TRAUMATOLOGÍA ──────────────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Forostian Natalia', 15, 6, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES
    (pid, esp_traumatologia),
    (pid, esp_ortopedia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 0, '16:00', '18:00', true, 'quincenal_1');

  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dr. Patiño Erick', 15, NULL, NULL, '1 Lunes o Martes del mes de 8-11 o 9-12hs')
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES
    (pid, esp_traumatologia),
    (pid, esp_ortopedia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 0, '08:00', '11:00', true, 'mensual_1');

  -- ── UROLOGÍA ───────────────────────────────────────────────
  INSERT INTO profesionales (nombre, duracion_turno, edad_minima, edad_maxima, notas)
  VALUES ('Dra. Kouchoyan Nadia', 10, 17, NULL, NULL)
  RETURNING id INTO pid;
  INSERT INTO profesional_especialidades (profesional_id, especialidad_id) VALUES (pid, esp_urologia);
  INSERT INTO disponibilidad_base (profesional_id, dia_semana, hora_inicio, hora_fin, activo, frecuencia)
  VALUES (pid, 2, '11:30', '13:00', true, 'quincenal_1');

END $$;
