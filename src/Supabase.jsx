import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ndxhdnakynyueccndnqd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5keGhkbmFreW55dWVjY25kbnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0NzYyMDksImV4cCI6MjA0NTA1MjIwOX0.BdeVdeT6Hwo580w4udWN-xQkBuTfxGGUds4NHmheuNw'
);

export const getAllRecord = async () => {
  const { data } = await supabase.from('study-record').select('*');
  return data;
};

export const insertRecordToSupabase = async (title, time) => {
  const { data } = await supabase
    .from('study-record')
    .insert({ title: title, time: time })
    .select()
  return data[0].id
}

export const deleteRecordFromSupabase = async (id) => {
  const response = await supabase
    .from('study-record')
    .delete()
    .eq('id', id)
  return response
}
