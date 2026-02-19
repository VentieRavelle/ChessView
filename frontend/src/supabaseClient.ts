import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cjxistmkgcbznnnavsmi.supabase.co';
const supabaseAnonKey = 'sb_publishable_7SzGB2oFjOMbmLGBHfLm_g_xLmpCafw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);