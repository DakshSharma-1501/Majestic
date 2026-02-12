// @ts-nocheck
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const bookingSchema = z.object({
  turf_id: z.string().uuid(),
  sport_id: z.string().uuid(),
  slot_id: z.string().uuid(),
  players_count: z.number().int().positive(),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is a customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'customer') {
      return NextResponse.json({ error: 'Only customers can create bookings' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = bookingSchema.parse(body)

    // Check if slot is available
    const { data: slot } = await supabase
      .from('slots')
      .select('is_available')
      .eq('id', validatedData.slot_id)
      .single()

    if (!slot?.is_available) {
      return NextResponse.json({ error: 'Slot is not available' }, { status: 400 })
    }

    // Create booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        customer_id: user.id,
        turf_id: validatedData.turf_id,
        sport_id: validatedData.sport_id,
        slot_id: validatedData.slot_id,
        players_count: validatedData.players_count,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
