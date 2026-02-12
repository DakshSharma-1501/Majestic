// @ts-nocheck
'use client'

import { createClient } from '@/lib/supabase/client'
import { Booking } from '@/types'
import { useEffect, useState } from 'react'

export function useBookingSubscription(userId: string, role: 'customer' | 'owner') {
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    const supabase = createClient()

    // Subscribe to booking changes
    const channel = supabase
      .channel('booking-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: role === 'customer' ? `customer_id=eq.${userId}` : undefined,
        },
        (payload) => {
          console.log('Booking update:', payload)
          // Refresh bookings when changes occur
          fetchBookings()
        }
      )
      .subscribe()

    const fetchBookings = async () => {
      let query = supabase.from('bookings').select('*')

      if (role === 'customer') {
        query = query.eq('customer_id', userId)
      } else {
        // For owners, get bookings for their turfs
        const { data: turfs } = await supabase
          .from('turfs')
          .select('id')
          .eq('owner_id', userId)

        if (turfs) {
          const turfIds = turfs.map((t) => t.id)
          query = query.in('turf_id', turfIds)
        }
      }

      const { data } = await query
      if (data) {
        setBookings(data)
      }
    }

    fetchBookings()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, role])

  return { bookings }
}
