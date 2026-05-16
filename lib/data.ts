export const WA_BASE = 'https://wa.me/5491122355689'
export const WA_TURNO = `${WA_BASE}?text=${encodeURIComponent('Hola, quiero sacar un turno')}`
export const WA_PRACTICA = `${WA_BASE}?text=${encodeURIComponent('Hola, quiero consultar por una práctica')}`

export function waEspecialidad(name: string) {
  return `${WA_BASE}?text=${encodeURIComponent(`Hola, quiero un turno con ${name}`)}`
}

export interface Especialidad {
  name: string
  icon: string
}

export const especialidades: Especialidad[] = [
  { name: 'Cardiología', icon: 'heart' },
  { name: 'Clínica médica', icon: 'stethoscope' },
  { name: 'Cirujano general', icon: 'scissors' },
  { name: 'Dermatología', icon: 'skin' },
  { name: 'Diabetología', icon: 'drop' },
  { name: 'Endocrinología', icon: 'flask' },
  { name: 'Endocrinología infantil', icon: 'flask' },
  { name: 'Ecografía y Doppler', icon: 'wave' },
  { name: 'Flebología', icon: 'vein' },
  { name: 'Ginecología', icon: 'female' },
  { name: 'Terapia ocupacional', icon: 'hands' },
  { name: 'Obstetricia', icon: 'baby' },
  { name: 'Gastroenterología', icon: 'stomach' },
  { name: 'Gastroenterología infantil', icon: 'stomach' },
  { name: 'Infectología', icon: 'virus' },
  { name: 'Ortopedia', icon: 'bone' },
  { name: 'Neumonología', icon: 'lung' },
  { name: 'Neumonología infantil', icon: 'lung' },
  { name: 'Neurología', icon: 'brain' },
  { name: 'Neurología infantil', icon: 'brain' },
  { name: 'Nutrición', icon: 'apple' },
  { name: 'Otorrinolaringología', icon: 'ear' },
  { name: 'Pediatría', icon: 'child' },
  { name: 'Proctología', icon: 'colon' },
  { name: 'Psicología', icon: 'mind' },
  { name: 'Psicopedagogía', icon: 'book' },
  { name: 'Psiquiatría adultos', icon: 'head' },
  { name: 'Psiquiatría infanto-juvenil', icon: 'head' },
  { name: 'Traumatología', icon: 'bone' },
  { name: 'Traumatología infantil', icon: 'bone' },
  { name: 'Urología', icon: 'kidney' },
  { name: 'Kinesiología', icon: 'exercise' },
  { name: 'Audiología', icon: 'ear' },
]

export const destacadas = especialidades.slice(0, 8)

export interface PracticaCategoria {
  categoria: string
  items: string[]
}

export const practicas: PracticaCategoria[] = [
  {
    categoria: 'Cardiología',
    items: ['Electrocardiograma', 'Ecocardiograma Doppler', 'Riesgo quirúrgico'],
  },
  {
    categoria: 'Neurología',
    items: [
      'Electroencefalograma de sueño',
      'Potenciales evocados',
      'Evaluaciones neurocognitivas (infantiles y adultos)',
    ],
  },
  {
    categoria: 'Ginecología',
    items: ['Papanicolau y colposcopía', 'Biopsias ginecológicas y de piel'],
  },
  {
    categoria: 'Otorrinolaringología',
    items: [
      'Lavado de oídos',
      'Audiometrías',
      'Logometrías',
      'Timpanometrías',
      'Otoemisiones acústicas',
      'Rinofibrolaringoscopía',
    ],
  },
  {
    categoria: 'Respiratorio',
    items: ['Espirometrías (infantiles y adultos)'],
  },
  {
    categoria: 'Dermatología',
    items: ['Tratamientos dermatológicos', 'Topicaciones', 'Biopsias de piel'],
  },
  {
    categoria: 'Flebología',
    items: ['FOAM / Espuma'],
  },
  {
    categoria: 'Ecografía',
    items: ['Ecografía y Doppler'],
  },
  {
    categoria: 'General',
    items: ['Aptos físicos y psicológicos', 'Terapias', 'Entre otros'],
  },
]

export const practicasDestacadas = [
  'Electrocardiograma',
  'Ecocardiograma Doppler',
  'Ecografía y Doppler',
  'Espirometrías',
  'Electroencefalograma de sueño',
  'Papanicolau y colposcopía',
]
