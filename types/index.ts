import { Database } from './database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Turf = Database['public']['Tables']['turfs']['Row']
export type Sport = Database['public']['Tables']['sports']['Row']
export type Slot = Database['public']['Tables']['slots']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']

export type UserRole = 'customer' | 'owner'
export type BookingStatus = 'pending' | 'accepted' | 'rejected'

export interface TurfWithSports extends Turf {
  sports: Sport[]
}

export interface SportWithSlots extends Sport {
  slots: Slot[]
}

export interface BookingWithDetails extends Booking {
  turf: Turf
  sport: Sport
  slot: Slot
  customer: Profile
}

export interface SlotWithSport extends Slot {
  sport: Sport
}
