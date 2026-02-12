// @ts-nocheck
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function CustomerDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify user is a customer
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'customer') {
    redirect('/dashboard/owner')
  }

  // Fetch customer bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      turf:turfs(name, location),
      sport:sports(name, price_per_slot),
      slot:slots(start_time, end_time)
    `)
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Track and manage your turf bookings</p>
      </div>

      {!bookings || bookings.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-500 mb-6">Start by browsing available turfs</p>
            <Button asChild>
              <Link href="/">Browse Turfs</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking: any) => (
            <Card key={booking.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-1">{booking.turf.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {booking.turf.location}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusColor(booking.status)}>
                    {booking.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Sport</p>
                      <p className="font-medium">{booking.sport.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Time Slot</p>
                      <p className="font-medium">{formatDate(booking.slot.start_time)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Players</p>
                      <p className="font-medium">{booking.players_count}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <div className="h-5 w-5 flex items-center justify-center text-blue-600 font-bold">₹</div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">{formatCurrency(booking.sport.price_per_slot)}</p>
                    </div>
                  </div>
                </div>

                {booking.booking_code && (
                  <div className="bg-blue-50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-1">Booking Code</p>
                    <p className="text-2xl font-bold text-blue-600 tracking-wider">
                      {booking.booking_code}
                    </p>
                  </div>
                )}

                {booking.verified_at && (
                  <div className="bg-green-50 rounded-xl p-3 mb-4">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ Verified on {formatDate(booking.verified_at)}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/bookings/${booking.id}`}>View Details</Link>
                  </Button>
                  {booking.status === 'accepted' && booking.qr_code_data && (
                    <Button variant="outline" asChild>
                      <Link href={`/bookings/${booking.id}#qr`}>Show QR</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
