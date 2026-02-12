export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          role: 'customer' | 'owner'
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          role: 'customer' | 'owner'
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: 'customer' | 'owner'
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      turfs: {
        Row: {
          id: string
          owner_id: string
          name: string
          location: string
          description: string | null
          images: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          location: string
          description?: string | null
          images?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          location?: string
          description?: string | null
          images?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      sports: {
        Row: {
          id: string
          turf_id: string
          name: string
          price_per_slot: number
          max_players: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          turf_id: string
          name: string
          price_per_slot: number
          max_players: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          turf_id?: string
          name?: string
          price_per_slot?: number
          max_players?: number
          created_at?: string
          updated_at?: string
        }
      }
      slots: {
        Row: {
          id: string
          sport_id: string
          start_time: string
          end_time: string
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sport_id: string
          start_time: string
          end_time: string
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sport_id?: string
          start_time?: string
          end_time?: string
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          customer_id: string
          turf_id: string
          sport_id: string
          slot_id: string
          players_count: number
          status: 'pending' | 'accepted' | 'rejected'
          booking_code: string | null
          qr_code_data: string | null
          verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          turf_id: string
          sport_id: string
          slot_id: string
          players_count: number
          status?: 'pending' | 'accepted' | 'rejected'
          booking_code?: string | null
          qr_code_data?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          turf_id?: string
          sport_id?: string
          slot_id?: string
          players_count?: number
          status?: 'pending' | 'accepted' | 'rejected'
          booking_code?: string | null
          qr_code_data?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
