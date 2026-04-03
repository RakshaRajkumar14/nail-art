import { supabase } from './supabaseClient'

// Services
export const fetchServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching services:', error)
    return []
  }
  return data
}

export const fetchServiceById = async (id) => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching service:', error)
    return null
  }
  return data
}

// Bookings
export const createBooking = async (bookingData) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()

  if (error) {
    console.error('Error creating booking:', error)
    throw error
  }
  return data
}

export const fetchBookings = async (email) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookings:', error)
    return []
  }
  return data
}

export const updateBookingStatus = async (bookingId, status) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
    .select()

  if (error) {
    console.error('Error updating booking:', error)
    throw error
  }
  return data
}

export const cancelBooking = async (bookingId) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .select()

  if (error) {
    console.error('Error cancelling booking:', error)
    throw error
  }
  return data
}
