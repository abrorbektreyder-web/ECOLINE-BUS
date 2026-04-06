import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  try {
    // Parse date range: selected day 00:00 → 23:59
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    let query = supabase
      .from('trips')
      .select('*')
      .gte('departure_time', startOfDay.toISOString())
      .lte('departure_time', endOfDay.toISOString())
      .order('departure_time', { ascending: true });

    if (from) {
      query = query.ilike('from_city', `%${from}%`);
    }
    if (to) {
      query = query.ilike('to_city', `%${to}%`);
    }

    const { data: trips, error } = await query;

    if (error) {
      console.error('Supabase error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no trips found for that specific date, fetch upcoming trips for this route
    if (!trips || trips.length === 0) {
      const { data: upcoming } = await supabase
        .from('trips')
        .select('*')
        .ilike('from_city', `%${from}%`)
        .ilike('to_city', `%${to}%`)
        .gte('departure_time', new Date().toISOString())
        .order('departure_time', { ascending: true })
        .limit(5);

      return NextResponse.json(upcoming || []);
    }

    return NextResponse.json(trips);
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
