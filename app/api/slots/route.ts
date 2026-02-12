// @ts-nocheck
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const slotSchema = z.object({
  sport_id: z.string().uuid(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = slotSchema.parse(body)

    // Verify user owns the turf
    const { data: sport } = await supabase
      .from('sports')
      .select('turf:turfs(owner_id)')
      .eq('id', validatedData.sport_id)
      .single()

    if (!sport || sport.turf.owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Create slot
    const { data: slot, error } = await supabase
      .from('slots')
      .insert(validatedData)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ slot }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
