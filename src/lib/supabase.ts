
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://epofftojgzzywrqndptp.supabase.co'
const supabaseKey = 'sb_publishable_F24uzDfNsNZai6VVnGIJ-Q_-wGXy3jS'

export const supabase = createClient(supabaseUrl, supabaseKey)
