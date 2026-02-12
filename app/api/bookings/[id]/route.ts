// @ts-nocheck
// @ts-nocheck
import { generateQRCode } from '@/lib/qr-utils'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const updateBookingSchema = z.object({
  status: z.enum(['accepted', 'rejected']),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get booking details
    const { data: booking } = await supabase
      .from('bookings')
      .select('*, turf:turfs(owner_id)')
      .eq('id', id)
      .single() as any

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Verify user is the turf owner
    if (booking.turf.owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const { status } = updateBookingSchema.parse(body)

    let updateData: any = { status }

    // Generate QR code if accepting booking
    if (status === 'accepted') {
      const qrCodeData = await generateQRCode(id)
      updateData.qr_code_data = qrCodeData
    }

    // Update booking
    const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ booking: updatedBooking })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
