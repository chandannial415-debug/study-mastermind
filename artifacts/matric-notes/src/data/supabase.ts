import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://g1x5OeugaZ6vcyxMkCwwDA.supabase.co';
const supabaseAnonKey = 'Sb_publishable_g1x5OeugaZ6vcyxMkCwwDA_jkhRWGDf';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
