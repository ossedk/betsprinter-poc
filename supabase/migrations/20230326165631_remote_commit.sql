alter table "public"."soccer_standings" drop constraint "soccer_standings_league_id_fkey";

alter table "public"."soccer_standings" drop constraint "soccer_standings_team_id_fkey";

alter table "public"."soccer_leagues" drop constraint "soccer_leagues_pkey";

alter table "public"."soccer_standings" drop constraint "soccer_standings_pkey";

alter table "public"."soccer_teams" drop constraint "soccer_teams_pkey";

drop index if exists "public"."soccer_leagues_pkey";

drop index if exists "public"."soccer_standings_pkey";

drop index if exists "public"."soccer_teams_pkey";

drop table "public"."soccer_leagues";

drop table "public"."soccer_standings";

drop table "public"."soccer_teams";

drop sequence if exists "public"."soccer_standings_id_seq";


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$function$
;


