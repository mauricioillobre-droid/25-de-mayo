import { redirect } from 'next/navigation'
import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase-server'
import { TurnosClient, type TurnoConJoins, type EspecialidadItem } from './TurnosClient'

export default async function TurnosPage() {
  /* Auth check */
  const serverClient = await createSupabaseServerClient()
  const {
    data: { user },
  } = await serverClient.auth.getUser()
  if (!user) redirect('/admin/login')

  /* Data fetch */
  const adminClient = createSupabaseAdminClient()

  const [turnosRes, especialidadesRes] = await Promise.all([
    adminClient
      .from('turnos')
      .select(
        `id, profesional_id, especialidad_id, paciente_nombre, paciente_telefono,
         fecha, hora_inicio, hora_fin, estado, origen, cobertura_medica, notas, created_at,
         profesionales(nombre),
         especialidades(nombre)`
      )
      .order('fecha', { ascending: false })
      .order('hora_inicio', { ascending: false }),
    adminClient.from('especialidades').select('id, nombre').order('nombre'),
  ])

  const turnos = (turnosRes.data ?? []) as unknown as TurnoConJoins[]
  const especialidades = (especialidadesRes.data ?? []) as EspecialidadItem[]

  return (
    <TurnosClient
      turnos={turnos}
      especialidades={especialidades}
      userEmail={user.email}
    />
  )
}
