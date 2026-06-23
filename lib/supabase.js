import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://muqndfmbugonajcxwmsb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cW5kZm1idWdvbmFqY3h3bXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxODkzMzksImV4cCI6MjA5Nzc2NTMzOX0.RjRdTTqAPkB6Xf1HHf1jMNgohCCki9_aqKxsJd2_enA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
