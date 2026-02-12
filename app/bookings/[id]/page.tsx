// @ts-nocheck
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Calendar, CheckCircle, Clock, MapPin, Users } from 'lucide-react'
import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch booking details
  const { data: booking } = await supabase
    .from('bookings')
    .select(`
      *,
      turf:turfs(name, location, description),
      sport:sports(name, price_per_slot, max_players),
      slot:slots(start_time, end_time),
      customer:profiles(name, phone)
    `)
    .eq('id', id)
    .single()

  if (!booking) {
    notFound()
  }

  // Verify user has access to this booking
  if (booking.customer_id !== user.id) {
    // Check if user is the turf owner
    const { data: turf } = await supabase
      .from('turfs')
      .select('owner_id')
      .eq('id', booking.turf_id)
      .single()

    if (!turf || turf.owner_id !== user.id) {
      redirect('/dashboard/customer')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'success'
      case 'rejected':
        return 'destructive'
      default:
        return 'warning'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Details</h1>
        <p className="text-gray-600">Booking ID: {booking.id.slice(0, 8)}</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-1">{booking.turf.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 text-base">
                <MapPin className="h-4 w-4" />
                {booking.turf.location}
              </CardDescription>
            </div>
            <Badge variant={getStatusColor(booking.status)} className="text-sm px-3 py-1">
              {booking.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sport</p>
                  <p className="font-semibold text-gray-900">{booking.sport.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time Slot</p>
                  <p className="font-semibold text-gray-900">{formatDate(booking.slot.start_time)}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Number of Players</p>
                  <p className="font-semibold text-gray-900">{booking.players_count} players</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <div className="h-5 w-5 flex items-center justify-center text-blue-600 font-bold">₹</div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(booking.sport.price_per_slot)}</p>
                </div>
              </div>
            </div>
          </div>

          {booking.booking_code && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">Booking Confirmation Code</p>
              <p className="text-3xl font-bold text-blue-600 tracking-wider">
                {booking.booking_code}
              </p>
              <p className="text-xs text-gray-500 mt-2">Show this code at the turf</p>
            </div>
          )}

          {booking.verified_at && (
            <div className="bg-green-50 rounded-xl p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Attendance Verified</p>
                <p className="text-sm text-green-700">Verified on {formatDate(booking.verified_at)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR Code Section */}
      {booking.status === 'accepted' && booking.qr_code_data && (
        <Card id="qr">
          <CardHeader>
            <CardTitle>QR Code</CardTitle>
            <CardDescription>Show this QR code at the turf for verification</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <Image
                src={booking.qr_code_data}
                alt="Booking QR Code"
                width={300}
                height={300}
                className="rounded-xl"
              />
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              This QR code is valid for 24 hours from generation
            </p>
          </CardContent>
        </Card>
      )}

      {booking.status === 'pending' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-center text-yellow-800">
              Your booking is pending approval from the turf owner. You'll be notified once it's accepted.
            </p>
          </CardContent>
        </Card>
      )}

      {booking.status === 'rejected' && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-center text-red-800">
              Unfortunately, this booking was rejected. Please try booking a different slot.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
