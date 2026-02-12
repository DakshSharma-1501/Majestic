// @ts-nocheck
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const sportSchema = z.object({
  turf_id: z.string().uuid(),
  name: z.string().min(1),
  price_per_slot: z.number().positive(),
  max_players: z.number().int().positive(),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = sportSchema.parse(body)

    // Verify user owns the turf
    const { data: turf } = await supabase
      .from('turfs')
      .select('owner_id')
      .eq('id', validatedData.turf_id)
      .single()

    if (!turf || turf.owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Create sport
    const { data: sport, error } = await supabase
      .from('sports')
      .insert(validatedData)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ sport }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
