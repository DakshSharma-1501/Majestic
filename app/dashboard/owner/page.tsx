// @ts-nocheck
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Calendar, MapPin, Plus, Users } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function OwnerDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify user is an owner
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'owner') {
    redirect('/dashboard/customer')
  }

  // Fetch owner's turfs
  const { data: turfs } = await supabase
    .from('turfs')
    .select(`
      *,
      sports(count)
    `)
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch pending bookings for owner's turfs
  const { data: pendingBookings } = await supabase
    .from('bookings')
    .select(`
      *,
      turf:turfs!inner(id, name, owner_id),
      sport:sports(name),
      slot:slots(start_time, end_time),
      customer:profiles(name, phone)
    `)
    .eq('turf.owner_id', user.id)
    .eq('status', 'pending')
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Owner Dashboard</h1>
          <p className="text-gray-600">Manage your turfs and bookings</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/owner/turfs/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Turf
          </Link>
        </Button>
      </div>

      {/* Pending Bookings */}
      {pendingBookings && pendingBookings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Pending Requests ({pendingBookings.length})
          </h2>
          <div className="grid gap-4">
            {pendingBookings.map((booking: any) => (
              <Card key={booking.id} className="border-l-4 border-l-yellow-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{booking.turf.name}</CardTitle>
                      <CardDescription>
                        {booking.customer.name} • {booking.sport.name}
                      </CardDescription>
                    </div>
                    <Badge variant="warning">PENDING</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium text-sm">{formatDate(booking.slot.start_time)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Players</p>
                        <p className="font-medium">{booking.players_count}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <div className="h-4 w-4 flex items-center justify-center text-blue-600 font-bold text-sm">₹</div>
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-medium">{formatCurrency(booking.sport.price_per_slot)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <form action={`/api/bookings/${booking.id}`} method="PATCH" className="flex-1">
                      <Button type="submit" className="w-full" size="sm">
                        Accept
                      </Button>
                    </form>
                    <Button variant="destructive" size="sm" className="flex-1">
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* My Turfs */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Turfs</h2>
        
        {!turfs || turfs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No turfs yet</h3>
              <p className="text-gray-500 mb-6">Create your first turf to start receiving bookings</p>
              <Button asChild>
                <Link href="/dashboard/owner/turfs/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Turf
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {turfs.map((turf: any) => (
              <Card key={turf.id} className="hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-2xl relative overflow-hidden">
                  {turf.images && turf.images.length > 0 ? (
                    <img
                      src={turf.images[0]}
                      alt={turf.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                      {turf.name.charAt(0)}
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{turf.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {turf.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                      {turf.sports?.[0]?.count || 0} sports
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/dashboard/owner/turfs/${turf.id}/edit`}>
                      Manage Turf
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
