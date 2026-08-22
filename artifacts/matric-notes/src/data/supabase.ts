import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://esyprtmgtomsnhckdqga.supabase.co/rest/v1/';
const supabaseAnonKey = 'sb_publishable_g1x5OeugaZ6vcyxMkCwwDA_jkhRWGDf';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
