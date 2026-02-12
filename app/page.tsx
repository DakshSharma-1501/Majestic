// @ts-nocheck
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import { MapPin, Users } from 'lucide-react'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Fetch all turfs with their sports
  const { data: turfs } = await supabase
    .from('turfs')
    .select(`
      *,
      sports (
        id,
        name,
        price_per_slot,
        max_players
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Book Your Perfect
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Sports Turf
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find and book premium sports turfs near you. Easy booking, instant confirmation.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="#turfs">Browse Turfs</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Turfs Grid */}
      <section id="turfs" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Turfs</h2>
        
        {!turfs || turfs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 mb-4">No turfs available yet.</p>
              <Button asChild>
                <Link href="/signup">Be the first to list a turf</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {turfs.map((turf) => (
              <Card key={turf.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                  {turf.images && turf.images.length > 0 ? (
                    <img
                      src={turf.images[0]}
                      alt={turf.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
                      {turf.name.charAt(0)}
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{turf.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {turf.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {turf.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {turf.description}
                    </p>
                  )}
                  
                  {turf.sports && turf.sports.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Available Sports:</p>
                      <div className="flex flex-wrap gap-2">
                        {turf.sports.slice(0, 3).map((sport: any) => (
                          <Badge key={sport.id} variant="secondary">
                            {sport.name}
                          </Badge>
                        ))}
                        {turf.sports.length > 3 && (
                          <Badge variant="outline">+{turf.sports.length - 3} more</Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {turf.sports && turf.sports.length > 0 && (
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Starting from</p>
                        <p className="text-lg font-bold text-blue-600">
                          {formatCurrency(Math.min(...turf.sports.map((s: any) => s.price_per_slot)))}
                          <span className="text-sm font-normal text-gray-500">/slot</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">
                          Up to {Math.max(...turf.sports.map((s: any) => s.max_players))}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button className="w-full" asChild>
                    <Link href={`/turfs/${turf.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
