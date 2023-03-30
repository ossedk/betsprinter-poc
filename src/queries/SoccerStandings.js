import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchSoccerStandings() {
    const { data: standings, error } = await supabase
    .from('soccer_standings')
    .select(`
        id,
        league_id,
        team_id,
        rank,
        points,
        goals_diff,
        form,
        status,
        description,
        all_played,
        all_win,
        all_draw,
        all_lose,
        all_goals_for,
        all_goals_against,
        home_played,
        home_win,
        home_draw,
        home_lose,
        home_goals_for,
        home_goals_against,
        away_played,
        away_win,
        away_draw,
        away_lose,
        away_goals_for,
        away_goals_against,
        last_update,
        soccer_teams (
            name,
            logo
            )
        `)
    .order('rank')
    if (error) {
      console.log(error);
      return null;
    }
    return standings;
}
  
