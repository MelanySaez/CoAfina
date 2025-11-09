import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://znnkrnexqrxxalrfaitt.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpubmtybmV4cXJ4eGFscmZhaXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NTM5MDQsImV4cCI6MjA3ODIyOTkwNH0.WhJeK0OsRM6jk2j6zanKm9hgRCBqBoheVlA4355uqKk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para TypeScript (ajustado a tu esquema real)
export interface CSVFile {
  id: string
  filename: string
  csv_filepath: string
  uploaded_at: string
}
