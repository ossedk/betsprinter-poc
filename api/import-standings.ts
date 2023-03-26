import axios from 'axios';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = process.env.REACT_APP_SUPABASE_URL ?? 'your_default_value_here';
const anonKey: string = process.env.REACT_APP_SUPABASE_ANON_KEY ?? 'your_default_value_here';
const supabase: SupabaseClient = createClient(supabaseUrl, anonKey);

interface HandlerResponse {
  statusCode: number;
  body: string;
}

export default async function handler(event: any, context: any): Promise<HandlerResponse> {
  const apiKey = event.headers['x-api-key'];
  const host = event.headers.host;

  // If the request is not coming from the server, return a 403 error
  if (!host.startsWith('localhost') && !host.endsWith('vercel.app')) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Forbidden: Access denied' }),
    };
  }

  if (apiKey !== process.env.API_KEY) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
    };
  }

  const options = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/standings',
    params: { season: '2022', league: '61' },
    headers: {
      'X-RapidAPI-Key': process.env.REACT_APP_RAPID_KEY,
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
    },
  };

  try {
    const response = await axios(options);
    const standingsData = response.data.response;
  
    for (const leagueData of standingsData) {
      const league = leagueData.league;
  
      // Insert the league data if it doesn't exist in the leagues table
      const { data: existingLeague } = await supabase
        .from('soccer_leagues')
        .select('*')
        .eq('id', league.id)
        .single();
  
      if (!existingLeague) {
        await supabase.from('soccer_leagues').insert([{
          id: league.id,
          name: league.name,
          country: league.country,
          logo: league.logo,
          flag: league.flag,
          season: league.season
        }]);
      }
  
      for (const standingGroup of league.standings) {
        for (const standing of standingGroup) {
          const team = standing.team;
  
          // Insert the team data if it doesn't exist in the teams table
          const { data: existingTeam } = await supabase
            .from('soccer_teams')
            .select('*')
            .eq('id', team.id)
            .single();
  
          if (!existingTeam) {
            await supabase.from('soccer_teams').insert([{
              id: team.id,
              name: team.name,
              logo: team.logo
            }]);
          }
  
          // Insert the standing data into the standings table
          await supabase.from('soccer_standings').insert([{
            league_id: league.id,
            team_id: team.id,
            rank: standing.rank,
            points: standing.points,
            goals_diff: standing.goalsDiff,
            form: standing.form,
            status: standing.status,
            description: standing.description,
            all_played: standing.all.played,
            all_win: standing.all.win,
            all_draw: standing.all.draw,
            all_lose: standing.all.lose,
            all_goals_for: standing.all.goals.for,
            all_goals_against: standing.all.goals.against,
            home_played: standing.home.played,
            home_win: standing.home.win,
            home_draw: standing.home.draw,
            home_lose: standing.home.lose,
            home_goals_for: standing.home.goals.for,
            home_goals_against: standing.home.goals.against,
            away_played: standing.away.played,
            away_win: standing.away.win,
            away_draw: standing.away.draw,
            away_lose: standing.away.lose,
            away_goals_for: standing.away.goals.for,
            away_goals_against: standing.away.goals.against,
            last_update: standing.update
          }]);
        }
      }
    }
  
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data imported successfully' }),
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching data' }),
    };
  }  
}

