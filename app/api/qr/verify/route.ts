// @ts-nocheck
import { verifyQRCode } from '@/lib/qr-utils'
import { createClient } from '@/lib/supabase/server'
import { isWithinInterval, parseISO } from 'date-fns'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const verifySchema = z.object({
  qrData: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { qrData } = verifySchema.parse(body)

    // Verify QR code
    const qrCodeData = verifyQRCode(qrData)
    if (!qrCodeData) {
      return NextResponse.json({ error: 'Invalid or expired QR code' }, { status: 400 })
    }

    // Get booking details
    const { data: booking } = await supabase
      .from('bookings')
      .select(`
        *,
        turf:turfs(owner_id, name),
        sport:sports(name),
        slot:slots(start_time, end_time),
        customer:profiles(name, phone)
      `)
      .eq('id', qrCodeData.bookingId)
      .single()

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Verify user is the turf owner
    if (booking.turf.owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if booking is accepted
    if (booking.status !== 'accepted') {
      return NextResponse.json({ error: 'Booking is not accepted' }, { status: 400 })
    }

    // Check if already verified
    if (booking.verified_at) {
      return NextResponse.json({
        message: 'Booking already verified',
        booking,
        alreadyVerified: true,
      })
    }

    // Verify slot time (allow check-in 30 minutes before start time)
    const now = new Date()
    const slotStart = parseISO(booking.slot.start_time)
    const slotEnd = parseISO(booking.slot.end_time)
    const checkInStart = new Date(slotStart.getTime() - 30 * 60 * 1000) // 30 min before

    const isValidTime = isWithinInterval(now, {
      start: checkInStart,
      end: slotEnd,
    })

    if (!isValidTime) {
      return NextResponse.json({
        error: 'Check-in time is outside the allowed window',
        slotTime: {
          start: booking.slot.start_time,
          end: booking.slot.end_time,
        },
      }, { status: 400 })
    }

    // Mark as verified
    const { data: verifiedBooking, error } = await supabase
      .from('bookings')
      .update({ verified_at: new Date().toISOString() })
      .eq('id', qrCodeData.bookingId)
      .select(`
        *,
        turf:turfs(name),
        sport:sports(name),
        slot:slots(start_time, end_time),
        customer:profiles(name, phone)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Booking verified successfully',
      booking: verifiedBooking,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
